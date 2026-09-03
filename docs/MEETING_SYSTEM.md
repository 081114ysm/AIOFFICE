# AI Office Meeting System

## 목적

Meeting은 채팅방이 아니라 여러 Agent의 의견을 모아 Decision과 실제 Action Item을 만드는 도메인 흐름이다.

## 생성 조건

의존성 충돌, 요구사항 불명확, 여러 역할 검토, QA 결함 원인 재논의가 발생하면 PM이 회의를 요청한다. CEO도 직접 시작할 수 있다.

## 생명주기

`SCHEDULED → IN_PROGRESS → COMPLETED` 또는 `CANCELLED`

## 저장 필드

Meeting은 `project_id`, `purpose`, `agenda`, `facilitator`, `participants`, `related_task_ids`, `transcript`, `summary`, `started_at`, `completed_at`을 저장한다. Transcript와 summary를 섞지 않는다.

Decision은 `question`, `options`, `chosen_option`, `rationale`, `decided_by`, `confidence`를 가진다. Action Item은 `title`, `assignee_agent_id`, `due_at`, `related_task_id`, `status`를 가진다.

## 알고리즘

```text
create → Context load → round-robin 의견
→ facilitator summary → Decision 추출
→ Action Item/Task 생성 → 관련 Task 갱신 → complete Event
```

참석 Agent 응답이 실패하면 transcript에 오류를 남기고 회의 성공으로 위장하지 않는다. 반복 실패 시 관련 Task를 `BLOCKED`로 바꾸고 재회의를 만든다.

## API와 권한

`POST /api/meetings`는 CEO·PM만 호출한다. 완료·취소는 서버 명령으로만 수행하며 상태 전이는 Event와 History에 기록한다.
