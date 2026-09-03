import { createId } from "../../common/id.mjs";
import { pool } from "../../infrastructure/database/postgres.mjs";
import { publish } from "../../infrastructure/events/event-bus.mjs";

export async function deliverAgentMessage(input) {
  if (!input.projectId || !input.content) throw Object.assign(new Error("projectId와 content가 필요합니다."), { statusCode: 400 });
  const message = (await pool.query(`insert into agent_messages (id, project_id, from_agent_id, to_agent_id, task_id, content, status, delivered_at)
    values ($1, $2, $3, $4, $5, $6, 'DELIVERED', now()) returning id, project_id, from_agent_id, to_agent_id, task_id, content, status, created_at, delivered_at`,
  [createId(), input.projectId, input.fromAgentId ?? null, input.toAgentId ?? null, input.taskId ?? null, String(input.content).slice(0, 8_000)])).rows[0];
  publish("AGENT_MESSAGE_DELIVERED", input.projectId, { messageId: message.id, fromAgentId: message.from_agent_id, toAgentId: message.to_agent_id, content: message.content });
  return message;
}

export async function rememberAgent(input) {
  if (!input.projectId || !input.summary) throw Object.assign(new Error("projectId와 summary가 필요합니다."), { statusCode: 400 });
  const memory = (await pool.query(`insert into memories (id, project_id, agent_id, type, summary, content) values ($1, $2, $3, $4, $5, $6) returning id, project_id, agent_id, type, summary, content, created_at`, [createId(), input.projectId, input.agentId ?? null, input.type || "WORKING_MEMORY", String(input.summary).slice(0, 500), JSON.stringify(input.content || {})])).rows[0];
  publish("AGENT_MEMORY_SAVED", input.projectId, { memoryId: memory.id, agentId: memory.agent_id, summary: memory.summary });
  return memory;
}

export async function recallAgent(input) {
  const params = [input.projectId]; const filters = ["project_id = $1"];
  if (input.agentId) { params.push(input.agentId); filters.push(`(agent_id = $${params.length} or agent_id is null)`); }
  if (input.query) { params.push(`%${String(input.query).slice(0, 100)}%`); filters.push(`(summary ilike $${params.length} or content::text ilike $${params.length})`); }
  return (await pool.query(`select id, project_id, agent_id, type, summary, content, created_at from memories where ${filters.join(" and ")} order by created_at desc limit 20`, params)).rows;
}
