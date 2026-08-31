import { pool } from "./postgres.mjs";

export async function getState() {
  const [preferences, projects, agents, tasks, conversations, messages, meetings, events] = await Promise.all([
    pool.query("select overlay_enabled from preferences where id = true"),
    pool.query("select id, name, description, status, created_at from projects order by created_at desc"),
    pool.query("select id, name, role, status, color from agents order by created_at"),
    pool.query("select id, project_id, title, status, assignee_agent_id from tasks order by created_at desc"),
    pool.query("select id, project_id, title, updated_at from conversations order by updated_at desc"),
    pool.query("select id, conversation_id, role, content, created_at from messages order by created_at desc limit 100"),
    pool.query("select id, project_id, title, status, created_at from meetings order by created_at desc"),
    pool.query("select id, type, project_id, payload, occurred_at from events order by occurred_at desc limit 50"),
  ]);
  return {
    preferences: { overlayEnabled: preferences.rows[0]?.overlay_enabled ?? false },
    projects: projects.rows.map((row) => ({ id: row.id, name: row.name, description: row.description, status: row.status, createdAt: row.created_at })),
    agents: agents.rows.map((row) => ({ id: row.id, name: row.name, role: row.role, status: row.status, color: row.color })),
    tasks: tasks.rows.map((row) => ({ id: row.id, projectId: row.project_id, title: row.title, status: row.status, assigneeAgentId: row.assignee_agent_id })),
    conversations: conversations.rows.map((row) => ({ id: row.id, projectId: row.project_id, title: row.title, updatedAt: row.updated_at })),
    messages: messages.rows.reverse().map((row) => ({ id: row.id, conversationId: row.conversation_id, role: row.role, content: row.content, createdAt: row.created_at })),
    meetings: meetings.rows.map((row) => ({ id: row.id, projectId: row.project_id, title: row.title, status: row.status, createdAt: row.created_at })),
    events: events.rows.reverse().map((row) => ({ id: row.id, type: row.type, projectId: row.project_id, payload: row.payload, occurredAt: row.occurred_at })),
  };
}
