# AI Office V1 MVP 구현 명세

## 문서 목적

`PROJECT_SPEC.md`가 제품 전체 방향이라면 이 문서는 V1 구현 계약이다. Notion 기본편의 12개 부서 운영 흐름과 심화편의 직원 상태·하루 시나리오·대표 지시창을 참고한다. V1에서는 외부 도구를 실행하지 않는다.

## 사용자 시나리오

```text
CEO 프로젝트 생성 → Conversation 지시 입력 → PM 요청 요약/Task 분해
→ dependency 순서 실행 → Agent 결과 저장 → QA 검토
→ Meeting Decision/Action Item → CEO 승인/반려
→ Summary/Memory/History 저장 → PAUSED 작업 Resume
```

## 포함 범위

- Project 생성·조회·상태 변경
- PM, RESEARCH, DEVELOPER, QA Agent와 Project membership
- Task·dependency·Agent Run·실행 로그
- Conversation·Message·sequence·summary/context snapshot
- Meeting·participant·transcript·Decision·Action Item
- QA Review와 CEO Approval
- append-only Event와 WebSocket 실시간 갱신
- 프로젝트·Task·Conversation Memory와 Resume
- Zustand 화면 캐시와 브라우저/Electron Overlay 설정 동기화

## 제외 범위

GitHub 쓰기, Terminal/File System/MCP 실행, 자동 채용, 조직 권한, 과금, 완전 자율 실행은 V2다. UI 버튼만 만들고 실제 명령을 실행하는 척하면 V1 완료가 아니다.

## REST 계약

| Method | Path | 권한 | 결과 |
|---|---|---|---|
| POST | `/api/projects` | CEO, PM | Project + 기본 Conversation |
| GET | `/api/state` | 로그인 사용자 | Office snapshot |
| GET | `/api/conversations/:id` | Project 접근자 | 대화·메시지·Task |
| POST | `/api/conversations/:id/messages` | CEO, PM, DEVELOPER, RESEARCH | Message + PM 요청 |
| POST | `/api/conversations/:id/resume` | CEO, PM | Resume Context/Event |
| POST | `/api/tasks/:id/run` | CEO, PM, DEVELOPER | dependency 검사 + Agent Run |
| POST | `/api/meetings` | CEO, PM | Meeting 생성 |
| POST | `/api/approvals/:id/approve` | CEO | 대기 대상 승인 |
| GET | `/ws` | 허용 Origin | Event stream |

모든 명령은 서버가 상태를 변경하고 관련 Event를 기록한다. 클라이언트가 Agent 상태를 직접 바꾸면 안 된다.

## 상태

- Project: `PLANNING | ACTIVE | PAUSED | WAITING_APPROVAL | DONE`
- Task: `TODO | READY | IN_PROGRESS | BLOCKED | IN_REVIEW | DONE | FAILED`
- Agent: `IDLE | WORKING | MEETING | WAITING | OFFLINE`
- Meeting: `SCHEDULED | IN_PROGRESS | COMPLETED | CANCELLED`
- Approval: `PENDING | APPROVED | REJECTED`

CEO 승인 전 Project는 `DONE`이 될 수 없다. 새로고침 후에도 Conversation·Task·Meeting·Approval이 DB에서 복원되어야 한다.

## 안전 규칙

모든 API는 세션 사용자와 Project 접근 권한을 확인한다. AI 원문과 화면 표시 텍스트를 분리하고 오류를 숨기지 않는다. Event는 append-only다.
