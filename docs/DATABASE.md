# AI Office Database

## 저장소 전략

V1은 PostgreSQL을 기준으로 한다. JSONB는 AI 원문 응답·Context snapshot처럼 구조가 자주 바뀌는 부가 데이터에만 사용하고, 조회·관계·상태 필드는 정규 컬럼으로 둔다.

## 핵심 테이블

```text
users
projects
agents
project_agents
conversations
messages
tasks
task_dependencies
agent_runs
meetings
meeting_participants
meeting_messages
decisions
action_items
qa_reviews
approvals
memories
events
```

## 공통 컬럼

주요 테이블은 `id UUID`, `created_at`, `updated_at`을 가진다. 삭제 대신 필요한 경우 `archived_at`을 사용한다. 모든 하위 데이터는 `project_id`를 가져 조회 범위와 권한 검사를 단순하게 한다.

## 관계

```text
Project 1─N Conversation 1─N Message
Project 1─N Task 1─N AgentRun
Task N─N Task (task_dependencies)
Meeting 1─N Decision / ActionItem
Task 1─N QAReview / Approval
Project 1─N Memory / Event
```

## 필수 제약

- Task dependency는 자기 자신을 참조할 수 없다.
- 같은 Task 쌍의 dependency는 중복될 수 없다.
- Agent Run은 하나의 Task와 하나의 Agent에 속한다.
- 승인 대상은 `WAITING_APPROVAL` 상태의 Project 또는 Task만 가능하다.
- Event는 append-only로 저장한다.
- 메시지 순서는 `created_at`만 믿지 말고 같은 Conversation 안에서 증가하는 `sequence`를 둔다.

## 인덱스

`tasks(project_id, status)`, `messages(conversation_id, sequence)`, `events(project_id, created_at)`, `agent_runs(task_id, created_at)`, `memories(project_id, type)`를 우선 추가한다. 무턱대고 모든 컬럼에 인덱스를 붙이면 쓰기 비용만 늘어난다.

## 예시 스키마

```sql
create table tasks (
  id uuid primary key,
  project_id uuid not null references projects(id),
  assignee_agent_id uuid references agents(id),
  title text not null,
  description text not null default '',
  status text not null check (status in ('TODO','READY','IN_PROGRESS','BLOCKED','IN_REVIEW','DONE','FAILED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

