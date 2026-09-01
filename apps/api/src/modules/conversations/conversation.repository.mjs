import { pool } from "../../infrastructure/database/postgres.mjs";
export const conversationRepository = {
  findById: async (id) => (await pool.query("select id, project_id, title from conversations where id = $1", [id])).rows[0],
  addMessage: async (message, sequence) => pool.query("insert into messages (id, conversation_id, role, content, sequence, created_at) values ($1, $2, $3, $4, $5, $6)", [message.id, message.conversationId, message.role, message.content, sequence, message.createdAt]),
  addTask: async (task) => pool.query("insert into tasks (id, project_id, title, status, assignee_agent_id) values ($1, $2, $3, $4, $5)", [task.id, task.projectId, task.title, task.status, task.assigneeAgentId]),
  save: async (conversation) => pool.query("update conversations set updated_at = now() where id = $1", [conversation.id]),
  nextSequence: async (conversationId) => Number((await pool.query("select coalesce(max(sequence), 0) + 1 as next from messages where conversation_id = $1", [conversationId])).rows[0].next),
  details: async (conversationId) => {
    const [conversation, messages, tasks] = await Promise.all([
      pool.query("select id, project_id, title, updated_at from conversations where id = $1", [conversationId]),
      pool.query("select id, role, content, sequence, created_at from messages where conversation_id = $1 order by sequence", [conversationId]),
      pool.query("select id, title, status, assignee_agent_id from tasks where project_id = (select project_id from conversations where id = $1) order by created_at desc", [conversationId]),
    ]);
    if (!conversation.rows[0]) return null;
    return { conversation: conversation.rows[0], messages: messages.rows, tasks: tasks.rows };
  },
  resume: async (conversationId, message) => {
    const conversation = await conversationRepository.findById(conversationId);
    if (!conversation) return null;
    const sequence = await conversationRepository.nextSequence(conversationId);
    await conversationRepository.addMessage({ id: createId(), conversationId, role: "SYSTEM", content: message, createdAt: now() }, sequence);
    await pool.query("insert into events (id, type, project_id, payload) values ($1, 'CONVERSATION_RESUMED', $2, $3)", [createId(), conversation.project_id, JSON.stringify({ conversationId })]);
    return conversationRepository.details(conversationId);
  },
};
