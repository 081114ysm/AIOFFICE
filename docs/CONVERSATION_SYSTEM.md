# AI Office Conversation System

## 역할

Conversation은 CEO가 프로젝트에 요청을 입력하고, Agent 작업과 결과를 확인하는 장기 작업 단위다. Message는 대화 표시용이고, Task·Meeting·Decision은 별도 엔티티로 저장해 검색과 상태 관리를 가능하게 한다.

## 구조

```text
Conversation
 ├─ Message (CEO / Agent / System)
 ├─ linked Project
 ├─ linked Task references
 ├─ linked Meeting references
 └─ Summary / Context snapshot
```

## 메시지 규칙

Message는 `role`, `content`, `sequence`, `metadata`, `created_at`을 가진다. AI 원문과 화면 표시용 텍스트를 구분하고, 서버가 sequence를 발급한다. 클라이언트 시간을 기준으로 정렬하면 기기 시계가 틀릴 때 순서가 깨진다.

## CEO 요청 흐름

```text
CEO message 저장
→ PM Run 생성
→ PM 결과(Task plan) 검증·저장
→ system message로 계획 표시
→ Agent Run 진행 메시지 연결
```

## Context 복원과 Resume

Conversation을 다시 열 때 `project summary`, 마지막 상태, 미완료 Task, 최근 메시지, 관련 Decision, Memory를 읽는다. PAUSED 상태에서 Resume하면 새 Conversation을 만들지 않고 기존 작업에 Resume Event를 추가한다. 이전 Context snapshot을 그대로 재사용하지 말고 현재 DB 상태와 합쳐야 한다.

## Summary 정책

긴 대화는 일정 메시지 수 또는 작업 완료 시 요약한다. Summary에는 현재 목표, 완료 사항, 미결정 사항, 다음 단계, 핵심 Decision, 관련 Task ID를 넣는다. 요약 실패가 원본 메시지를 삭제하는 근거가 되면 안 된다.

## V1 API 초안

```text
POST /projects/:projectId/conversations
GET  /conversations/:conversationId
POST /conversations/:conversationId/messages
POST /conversations/:conversationId/resume
GET  /conversations/:conversationId/events
```

## 표시 원칙

Conversation 화면과 Pixel Office 화면은 같은 Event stream을 구독한다. 한쪽만 로컬 상태로 갱신하면 새로고침·다중 탭에서 서로 다른 회사가 된다.

## 작업 완료 알림

프론트는 `AGENT_RUN_COMPLETED` Event를 감지하면 Zustand 알림 목록에 Toast를 추가하고, 브라우저 `Notification API` 권한이 허용된 경우 시스템 알림도 띄운다. 브라우저가 완전히 종료된 상태에서 알림을 보내는 Web Push는 V2에서 VAPID 구독과 Service Worker를 추가해야 한다.
