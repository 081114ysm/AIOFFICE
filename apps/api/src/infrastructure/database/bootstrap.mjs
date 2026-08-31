import { pool } from "./postgres.mjs";

const agents = [
  ["11111111-1111-4111-8111-111111111111", "PM Agent", "PM", "#818cf8"],
  ["22222222-2222-4222-8222-222222222222", "Research Agent", "RESEARCH", "#60a5fa"],
  ["33333333-3333-4333-8333-333333333333", "Developer Agent", "DEVELOPER", "#38bdf8"],
  ["44444444-4444-4444-8444-444444444444", "QA Agent", "QA", "#93a4ff"],
];
export async function bootstrapDatabase() {
  await pool.query("insert into preferences (id) values (true) on conflict (id) do nothing");
  for (const [id, name, role, color] of agents) await pool.query("insert into agents (id, name, role, color) values ($1, $2, $3, $4) on conflict (id) do nothing", [id, name, role, color]);
  const project = await pool.query("insert into projects (id, name, description, status) values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'AI Office Workspace', '실제 AI Office 작업 공간', 'ACTIVE') on conflict (id) do update set updated_at = now() returning id");
  await pool.query("insert into project_agents (project_id, agent_id, role) values ($1, $2, $3), ($1, $4, $5), ($1, $6, $7), ($1, $8, $9) on conflict do nothing", [project.rows[0].id, agents[0][0], agents[0][2], agents[1][0], agents[1][2], agents[2][0], agents[2][2], agents[3][0], agents[3][2]]);
  await pool.query("insert into conversations (id, project_id, title) values ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', $1, 'AI Office 작업 대화') on conflict (id) do nothing", [project.rows[0].id]);
  await pool.query("insert into messages (id, conversation_id, role, content, sequence) select 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'SYSTEM', 'AI Office 작업 공간이 준비되었습니다.', 1 where not exists (select 1 from messages where conversation_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb')");
}
