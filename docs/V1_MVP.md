# AI Office V1 MVP

## 목적

사용자가 CEO가 되어 AI Agent에게 업무를 요청하고, 프로젝트·Task·Conversation·Meeting·Decision·QA·Approval·Memory·History를 하나의 흐름으로 관리하는 첫 번째 구현 버전이다.

`PROJECT_SPEC.md`는 전체 제품 방향과 V2까지의 원문 기준 문서이고, 이 문서는 V1 구현 범위를 고정하는 실행 기준 문서다.

## 핵심 사용자 시나리오

1. CEO가 프로젝트를 생성한다.
2. CEO가 Conversation에서 업무를 요청한다.
3. PM Agent가 요구사항을 요약하고 Task를 분해한다.
4. PM이 Researcher·Developer·QA에게 Task를 할당한다.
5. Agent가 순서대로 실행하고 상태를 변경한다.
6. 협업이 필요하면 Meeting을 열고 결과와 Action Item을 만든다.
7. QA가 결과를 검증한다.
8. CEO가 승인하거나 반려한다.
9. 결과·Decision·요약이 Memory와 History에 저장된다.
10. PAUSED 프로젝트의 Conversation을 다시 열어 Resume한다.

## V1 포함 범위

- 프로젝트 1개 이상 생성·조회·상태 변경
- PM, Research, Developer, QA Agent
- Task 상태, 담당 Agent, 의존성
- Agent Run과 실행 로그
- Conversation과 메시지 저장
- Meeting, 참석 Agent, transcript, Decision, Action Item
- QA 결과와 CEO Approval
- Event 기반 상태 변경 및 실시간 갱신
- Task/Project/Conversation Memory와 Summary
- 작업 중단·재개(Resume)

## V1 제외 범위

GitHub 실제 조작, Terminal/File System/MCP Tool 실행, Agent 자동 채용, 다중 조직 권한, 비용 과금, 고급 검색·포크·브랜치, 완전 자율 실행은 V2로 미룬다. UI에서 버튼만 먼저 만들어 놓는 식의 가짜 통합은 V1 완료로 인정하지 않는다.

## 완료 조건

- 새 프로젝트를 만들고 Conversation에서 요청을 입력할 수 있다.
- PM이 요청을 Task로 분해한 기록이 남는다.
- Task 의존성이 준비된 순서로 Agent Run을 생성한다.
- Agent 상태가 `IDLE → WORKING → MEETING/WAITING → DONE` 흐름을 따른다.
- Meeting 결과가 Decision·Action Item으로 저장된다.
- QA가 PASS/FAIL과 근거를 남긴다.
- CEO 승인 전에는 프로젝트를 완료할 수 없다.
- 새로고침 후에도 Conversation·Task·Meeting·Approval 기록이 복원된다.
- PAUSED 작업을 Resume하면 이전 Summary와 최근 메시지가 Context로 주입된다.

## 구현 순서

1. 저장소 골격과 공통 타입
2. Project·Agent·Task CRUD
3. Conversation·Message와 PM 요청 흐름
4. 의존성 기반 Agent Run
5. Meeting·Decision·Action Item
6. QA·Approval
7. Event/WebSocket과 Office UI
8. Summary·Memory·Resume
9. 시나리오 테스트와 운영 로그

## V1 상태 규칙

프로젝트: `PLANNING | ACTIVE | PAUSED | WAITING_APPROVAL | DONE`

Task: `TODO | READY | IN_PROGRESS | BLOCKED | IN_REVIEW | DONE | FAILED`

Agent: `IDLE | WORKING | MEETING | WAITING | OFFLINE`

Meeting: `SCHEDULED | IN_PROGRESS | COMPLETED | CANCELLED`

Approval: `PENDING | APPROVED | REJECTED`

상태 변경은 임의의 화면 로컬 상태가 아니라 서버 Event와 History에 기록된 명령의 결과여야 한다.

