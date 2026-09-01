# AI Office Database

## 저장소 원칙

PostgreSQL이 유일한 영구 저장소다. Repository에서 in-memory 배열을 사용하지 않는다. JSONB는 AI 원문·Context snapshot·metadata에만 사용한다.

## 테이블

```text
users, sessions
projects, agents, project_agents
conversations, messages
tasks, task_dependencies, agent_runs
meetings, meeting_participants, meeting_messages
decisions, action_items, qa_reviews, approvals
memories, events
```

모든 주요 테이블은 `id uuid`, `created_at`, `updated_at`을 사용하며 하위 데이터는 `project_id`를 가진다. 삭제보다 `archived_at`을 우선한다.

## 관계

```text
Project 1-N Conversation 1-N Message
Project 1-N Task 1-N AgentRun
Task N-N Task (task_dependencies)
Meeting 1-N Decision / ActionItem
Task 1-N QAReview / Approval
Project 1-N Memory / Event
```

## 제약

- dependency는 자기 자신을 참조할 수 없고 중복될 수 없다.
- Agent Run은 하나의 Task와 Agent에 속한다.
- Approval 대상은 `WAITING_APPROVAL` Project 또는 `IN_REVIEW` Task만 허용한다.
- Event는 append-only다.
- Message는 Conversation별 unique `sequence`로 정렬한다.
- Session에는 원문 토큰이 아닌 hash만 저장한다.

`meeting_messages`는 회의 발언을 저장하는 별도 로그이며 일반 Conversation Message와 섞지 않는다. 현재 초기 스키마에 없는 테이블은 다음 migration에서 추가한다.

## 인덱스

`tasks(project_id,status)`, `messages(conversation_id,sequence)`, `agent_runs(task_id,started_at)`, `events(project_id,occurred_at)`, `memories(project_id,type)`, `sessions(token_hash)`를 우선한다.

## 트랜잭션

Project 생성은 Project·기본 Conversation·초기 System Message·Project Agent 연결을 한 transaction으로 처리한다. Task 실행 시작은 Agent Run·Agent WORKING·Task IN_PROGRESS를 한 transaction으로 처리한다. 승인과 DONE 전환도 한 transaction이어야 한다.

## 마이그레이션

`apps/api/sql/001_initial_schema.sql`은 반복 실행 가능해야 한다. 운영 migration은 번호를 증가시키며 기존 migration을 수정하지 않는다.
