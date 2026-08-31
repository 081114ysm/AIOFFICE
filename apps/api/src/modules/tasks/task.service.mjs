import { publish } from "../../infrastructure/events/event-bus.mjs";
import { taskRepository } from "./task.repository.mjs";
export function runTask(taskId) { const task = taskRepository.findById(taskId); if (!task) throw Object.assign(new Error("Task not found"), { statusCode: 404 }); task.status = "IN_PROGRESS"; const agent = task.assigneeAgentId; publish("AGENT_RUN_STARTED", task.projectId, { taskId, agentId: agent }); setTimeout(() => { task.status = "IN_REVIEW"; publish("AGENT_RUN_COMPLETED", task.projectId, { taskId, agentId: agent }); }, 800); return task; }

