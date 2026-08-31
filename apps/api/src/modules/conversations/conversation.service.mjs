import { createId, now } from "../../common/id.mjs";
import { publish } from "../../infrastructure/events/event-bus.mjs";
import { getSnapshot } from "../../infrastructure/database/store.snapshot.mjs";
import { conversationRepository } from "./conversation.repository.mjs";
export function addMessage(conversationId, input) { const conversation = conversationRepository.findById(conversationId); if (!conversation) throw Object.assign(new Error("Conversation not found"), { statusCode: 404 }); const message = { id: createId(), conversationId, role: input.role || "CEO", content: input.content || "", createdAt: now() }; conversationRepository.addMessage(message); conversation.updatedAt = now(); if (message.role === "CEO") { const task = { id: createId(), projectId: conversation.projectId, title: message.content.slice(0, 60), status: "READY", assigneeAgentId: "agent-pm" }; conversationRepository.addTask(task); conversationRepository.addMessage({ id: createId(), conversationId, role: "PM", content: `요청을 접수했습니다. '${task.title}' 작업을 Task로 만들고 실행을 준비했습니다.`, createdAt: now() }); publish("TASK_CREATED", conversation.projectId, { taskId: task.id }); } return { message, state: getSnapshot() }; }

