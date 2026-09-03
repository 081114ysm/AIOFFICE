import { publish } from "../../infrastructure/events/event-bus.mjs";
import { taskRepository } from "./task.repository.mjs";
import { pool } from "../../infrastructure/database/postgres.mjs";
import { createId } from "../../common/id.mjs";
export async function runTask(taskId) {
  const task = await taskRepository.findById(taskId);
  if (!task) throw Object.assign(new Error("Task not found"), { statusCode: 404 });
  if (!["READY", "TODO", "FAILED"].includes(task.status)) throw Object.assign(new Error("현재 상태에서는 Task를 실행할 수 없습니다."), { statusCode: 409 });
  const dependencies = (await pool.query("select t.status from task_dependencies d join tasks t on t.id = d.depends_on_task_id where d.task_id = $1", [taskId])).rows;
  if (dependencies.some((dependency) => dependency.status !== "DONE")) throw Object.assign(new Error("선행 Task가 모두 완료되어야 실행할 수 있습니다."), { statusCode: 409 });
  const runId = createId();
  await pool.query("insert into agent_runs (id, task_id, agent_id, status, input) values ($1, $2, $3, 'RUNNING', $4)", [runId, taskId, task.assignee_agent_id, JSON.stringify({ source: "CEO_COMMAND" })]);
  await pool.query("update agents set status = 'WORKING' where id = $1", [task.assignee_agent_id]);
  task.status = "IN_PROGRESS";
  const saved = await taskRepository.save(task);
  publish("AGENT_RUN_STARTED", task.project_id, { taskId, agentId: task.assignee_agent_id, runId });
  setTimeout(async () => {
    try {
      await pool.query("update agent_runs set status = 'COMPLETED', output = $2, completed_at = now() where id = $1", [runId, JSON.stringify({ summary: "Agent 실행 결과가 QA 검토 대기 상태로 저장되었습니다." })]);
      await pool.query("update agents set status = 'IDLE' where id = $1", [task.assignee_agent_id]);
      task.status = "IN_REVIEW";
      await taskRepository.save(task);
      publish("AGENT_RUN_COMPLETED", task.project_id, { taskId, agentId: task.assignee_agent_id, runId });
    } catch (error) { await pool.query("update agent_runs set status = 'FAILED', error = $2, completed_at = now() where id = $1", [runId, error instanceof Error ? error.message : "Agent 실행 실패"]); publish("AGENT_RUN_FAILED", task.project_id, { taskId, agentId: task.assignee_agent_id, runId }); }
  }, 800);
  return { ...saved, runId };
}
