import { pool } from "../../infrastructure/database/postgres.mjs";
export const taskRepository = {
  findById: async (id) => (await pool.query("select id, project_id, title, status, assignee_agent_id from tasks where id = $1", [id])).rows[0],
  save: async (task) => (await pool.query("update tasks set status = $2, updated_at = now() where id = $1 returning id, project_id, title, status, assignee_agent_id", [task.id, task.status])).rows[0],
};
