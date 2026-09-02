import { pool } from "./postgres.mjs";

const departments = [
  ["시장조사팀", "RESEARCH", 3, "#38bdf8", 8, 18], ["브랜드 인텔리전스팀", "RESEARCH", 3, "#60a5fa", 20, 9],
  ["콘텐츠 전략 1팀", "PM", 3, "#818cf8", 27, 9], ["브랜드 QA", "QA", 3, "#a78bfa", 48, 18],
  ["콘텐츠 전략 2팀", "PM", 3, "#6366f1", 8, 34], ["릴스 제작팀", "DEVELOPER", 3, "#06b6d4", 27, 34],
  ["캐러셀 제작팀", "DEVELOPER", 3, "#22d3ee", 48, 34], ["파트너십 소통팀", "PM", 2, "#14b8a6", 8, 50],
  ["재무·사업관리팀", "PM", 2, "#10b981", 27, 50], ["성과리뷰팀", "QA", 3, "#fbbf24", 47, 50],
  ["자동화 운영", "DEVELOPER", 2, "#22c55e", 8, 65], ["비서실", "PM", 2, "#3b82f6", 27, 65],
];
const names = ["이조사", "오뉴스", "한트렌드", "윤페르소나", "배지표", "박기획", "정아이디어", "서카피", "최검수", "김QA", "류근거", "장대본", "조문장", "문릴스", "임자막", "권썸네일", "강캐러셀", "노레이아웃", "신텍스트", "김파트너", "이답장", "오재무", "배정산", "유성과", "하패턴", "김리포트", "도자동화", "차재시도", "김세리", "이비서", "정취합", "한브리핑"];
const speechByRole = { PM: "업무 우선순위를 정리하고 있어요", RESEARCH: "공식 출처를 확인하고 있어요", DEVELOPER: "결과물을 제작하고 있어요", QA: "품질 기준을 검수하고 있어요" };

const legacyIds = ["11111111-1111-4111-8111-111111111111", "22222222-2222-4222-8222-222222222222", "33333333-3333-4333-8333-333333333333", "44444444-4444-4444-8444-444444444444"];
function agentId(index) { return legacyIds[index] ?? `00000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`; }

export async function bootstrapDatabase() {
  await pool.query("insert into preferences (id) values (true) on conflict (id) do nothing");
  let index = 0;
  for (const [department, role, count, color, baseX, baseY] of departments) {
    for (let seat = 0; seat < count; seat += 1) {
      const id = agentId(index); const name = names[index]; const isManager = seat === 0;
      await pool.query(`insert into agents (id, name, role, department, color, position_x, position_y, room_id, speech, is_manager)
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        on conflict (id) do update set name = excluded.name, role = excluded.role, department = excluded.department,
        color = excluded.color, position_x = excluded.position_x, position_y = excluded.position_y, room_id = excluded.room_id,
        speech = excluded.speech, is_manager = excluded.is_manager`,
      [id, name, role, department, color, baseX + seat * 5, baseY + (seat % 2) * 4, department, isManager ? `${name} 팀장입니다. ${speechByRole[role]}` : speechByRole[role], isManager]);
      index += 1;
    }
  }
  const project = await pool.query("insert into projects (id, name, description, status) values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'AI Office Workspace', '실제 AI Office 작업 공간', 'ACTIVE') on conflict (id) do update set updated_at = now() returning id");
  await pool.query("insert into project_agents (project_id, agent_id, role) select $1, id, role from agents on conflict do nothing", [project.rows[0].id]);
  await pool.query("insert into conversations (id, project_id, title) values ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', $1, 'AI Office 작업 대화') on conflict (id) do nothing", [project.rows[0].id]);
  await pool.query("insert into messages (id, conversation_id, role, content, sequence) select 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'SYSTEM', 'AI Office 32명 에이전트 월드가 준비되었습니다.', 1 where not exists (select 1 from messages where conversation_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb')");
}
