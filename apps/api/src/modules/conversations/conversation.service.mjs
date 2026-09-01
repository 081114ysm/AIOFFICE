import { createId, now } from "../../common/id.mjs";
import { publish } from "../../infrastructure/events/event-bus.mjs";
import { conversationRepository } from "./conversation.repository.mjs";
export async function addMessage(conversationId, input) {
  const conversation = await conversationRepository.findById(conversationId);
  if (!conversation) throw Object.assign(new Error("Conversation not found"), { statusCode: 404 });
  const message = { id: createId(), conversationId, role: input.role || "CEO", content: String(input.content || "").slice(0, 8_000), createdAt: now() };
  let sequence = await conversationRepository.nextSequence(conversationId);
  await conversationRepository.addMessage(message, sequence++);
  conversation.updatedAt = now();
  if (message.role === "CEO") {
    const task = { id: createId(), projectId: conversation.project_id, title: message.content.slice(0, 60), status: "READY", assigneeAgentId: "11111111-1111-4111-8111-111111111111" };
    await conversationRepository.addTask(task);
    await conversationRepository.addMessage({ id: createId(), conversationId, role: "PM", content: `요청을 접수했습니다. '${task.title}' 작업을 준비했습니다.`, createdAt: now() }, sequence);
    publish("TASK_CREATED", conversation.project_id, { taskId: task.id });
  }
  await conversationRepository.save(conversation);
  return { message };
}
