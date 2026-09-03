import { createId } from "../../common/id.mjs";
import { publish } from "../../infrastructure/events/event-bus.mjs";
import { pool } from "../../infrastructure/database/postgres.mjs";

export async function reviewTask(taskId, input = {}) {
  const result = input.result === "PASS" ? "PASS" : input.result === "FAIL" ? "FAIL" : null;
  if (!result) throw Object.assign(new Error("QA 결과는 PASS 또는 FAIL이어야 합니다."), { statusCode: 400 });
  const client = await pool.connect();
  try {
    await client.query("begin");
    const task = (await client.query("select id, project_id, status from tasks where id = $1 for update", [taskId])).rows[0];
    if (!task) throw Object.assign(new Error("Task not found"), { statusCode: 404 });
    if (task.status !== "IN_REVIEW") throw Object.assign(new Error("IN_REVIEW 상태의 Task만 QA할 수 있습니다."), { statusCode: 409 });
    await client.query("insert into qa_reviews (id, project_id, task_id, result, evidence) values ($1, $2, $3, $4, $5)", [createId(), task.project_id, task.id, result, String(input.evidence || "").slice(0, 8_000)]);
    await client.query("update tasks set status = $2, updated_at = now() where id = $1", [task.id, result === "PASS" ? "DONE" : "FAILED"]);
    if (result === "PASS") await client.query("update projects set status = 'WAITING_APPROVAL', workflow_stage = 'APPROVAL', updated_at = now() where id = $1 and status in ('ACTIVE', 'PLANNING')", [task.project_id]);
    await client.query("commit");
    publish(result === "PASS" ? "QA_PASSED" : "QA_FAILED", task.project_id, { taskId: task.id, evidence: input.evidence || "" });
    return { taskId: task.id, projectId: task.project_id, result };
  } catch (error) { await client.query("rollback"); throw error; } finally { client.release(); }
}
