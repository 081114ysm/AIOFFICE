import { pool } from "../../infrastructure/database/postgres.mjs";
export const projectRepository = {
  findById: async (id) => (await pool.query("select id, name, description, status, workflow_stage, created_at from projects where id = $1", [id])).rows[0],
  create: async (project) => {
    const client = await pool.connect();
    try {
      await client.query("begin");
      const result = (await client.query("insert into projects (id, name, description, status, created_at, updated_at) values ($1, $2, $3, $4, $5, $5) returning id, name, description, status, created_at", [project.id, project.name, project.description, project.status, project.createdAt])).rows[0];
      const conversationId = crypto.randomUUID();
      await client.query("insert into conversations (id, project_id, title) values ($1, $2, $3)", [conversationId, project.id, `${project.name} 작업 대화`]);
      await client.query("insert into messages (id, conversation_id, role, content, sequence) values ($1, $2, 'SYSTEM', $3, 1)", [crypto.randomUUID(), conversationId, `${project.name} 프로젝트가 생성되었습니다. CEO의 첫 지시를 기다리는 중입니다.`]);
      await client.query("insert into project_agents (project_id, agent_id, role) select $1, id, role from agents where role in ('PM', 'RESEARCH', 'DEVELOPER', 'QA') on conflict do nothing", [project.id]);
      await client.query("commit");
      return result;
    } catch (error) { await client.query("rollback"); throw error; } finally { client.release(); }
  },
  save: async (project) => (await pool.query("update projects set name = $2, description = $3, status = $4, workflow_stage = $5, updated_at = now() where id = $1 returning id, name, description, status, workflow_stage, updated_at", [project.id, project.name, project.description, project.status, project.workflow_stage ?? "RESEARCH"])).rows[0],
};
