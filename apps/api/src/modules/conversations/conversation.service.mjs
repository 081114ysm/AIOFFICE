import { createId, now } from "../../common/id.mjs";
import { publish } from "../../infrastructure/events/event-bus.mjs";
import { conversationRepository } from "./conversation.repository.mjs";
import { pool } from "../../infrastructure/database/postgres.mjs";
import { generateAgentResponse } from "../ai/openai.client.mjs";
import { rememberAgent } from "../agents/agent-collaboration.service.mjs";
import { buildCompanyPrompt } from "../ai/company-policy.mjs";
export async function addMessage(conversationId, input) {
  const conversation = await conversationRepository.findById(conversationId);
  if (!conversation) throw Object.assign(new Error("Conversation not found"), { statusCode: 404 });
  const message = { id: createId(), conversationId, role: input.role || "CEO", content: String(input.content || "").slice(0, 8_000), createdAt: now() };
  let sequence = await conversationRepository.nextSequence(conversationId);
  await conversationRepository.addMessage(message, sequence++);
  conversation.updatedAt = now();
  if (message.role === "CEO") {
    await pool.query("update projects set workflow_stage = 'RESEARCH', status = 'ACTIVE', updated_at = now() where id = $1", [conversation.project_id]);
    const task = { id: createId(), projectId: conversation.project_id, title: message.content.slice(0, 60), status: "READY", assigneeAgentId: "11111111-1111-4111-8111-111111111111" };
    await conversationRepository.addTask(task);
    await conversationRepository.addMessage({ id: createId(), conversationId, role: "PM", content: `요청을 접수했습니다. '${task.title}' 작업을 준비했습니다.`, createdAt: now() }, sequence);
    sequence += 1;
    publish("TASK_CREATED", conversation.project_id, { taskId: task.id });
    publish("WORKFLOW_STARTED", conversation.project_id, { taskId: task.id, stage: "RESEARCH" });
    await pool.query("update agents set status = 'WORKING', speech = '대표님 지시를 분석하고 있어요' where id = $1", [task.assigneeAgentId]);
    publish("AGENT_SPEECH_STARTED", conversation.project_id, { agentId: task.assigneeAgentId, taskId: task.id });
    try {
      const response = await generateAgentResponse(buildCompanyPrompt(message.content));
      await conversationRepository.addMessage({ id: createId(), conversationId, role: "PM", content: response.text, createdAt: now() }, sequence);
      await rememberAgent({ projectId: conversation.project_id, agentId: task.assigneeAgentId, type: "CONVERSATION", summary: message.content.slice(0, 500), content: { response: response.text, taskId: task.id, model: response.model } });
      await pool.query("update agents set status = 'IDLE', speech = $2 where id = $1", [task.assigneeAgentId, response.text.slice(0, 300)]);
      publish("AGENT_SPEECH", conversation.project_id, { agentId: task.assigneeAgentId, taskId: task.id, content: response.text, model: response.model });
    } catch (error) {
      const reason = error instanceof Error ? error.message : "AI 응답 실패";
      await pool.query("update agents set status = 'IDLE', speech = $2 where id = $1", [task.assigneeAgentId, "AI 응답을 준비하지 못했어요. 확인이 필요합니다."]);
      publish("AGENT_SPEECH_FAILED", conversation.project_id, { agentId: task.assigneeAgentId, taskId: task.id, error: reason });
    }
  }
  await conversationRepository.save(conversation);
  return { message };
}
