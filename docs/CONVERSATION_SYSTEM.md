# AI Office Conversation System

## 역할

Conversation은 CEO 요청과 Agent 업무 진행을 연결하는 장기 작업 단위다. Message는 표시용 로그이고 Task·Meeting·Decision·Memory는 별도 Entity로 저장한다.

## 구조

```text
Conversation
 ├─ Message(role, content, sequence, metadata)
 ├─ linked Project
 ├─ linked Task references
 ├─ linked Meeting references
 └─ Summary / Context snapshot
```

## CEO 요청 처리

```text
CEO Message 저장 → PM Agent Run 생성 → PM 계획 JSON 검증
→ Task/dependency 저장 → System Message 계획 표시
→ Agent Run 진행·결과 Message 연결
```

서버가 Conversation별 `sequence`를 발급한다. 클라이언트 시간으로 정렬하지 않는다. AI 원문과 화면용 요약을 구분한다.

## Resume

`POST /api/conversations/:id/resume`은 새 Conversation을 만들지 않는다. 현재 DB의 Project summary, 마지막 상태, 미완료 Task, 최근 메시지, Decision, Memory를 다시 읽고 `CONVERSATION_RESUMED` Event와 System Message를 추가한다.

## Summary

메시지 임계치 초과 또는 작업 완료 시 summary를 만든다. 필수 항목은 현재 목표, 완료 사항, 미결정 사항, 다음 단계, 핵심 Decision, 관련 Task ID다. 요약 실패가 원본 Message 삭제 사유가 되면 안 된다.

## 실시간과 알림

Conversation과 Pixel Office는 같은 Event stream을 구독한다. `AGENT_RUN_COMPLETED` 수신 시 Zustand Toast를 추가하고 Notification API 권한이 있으면 시스템 알림을 보낸다. 종료 상태 Web Push는 V2에서 VAPID와 Service Worker로 추가한다.

## 오류

로그인 없음은 401, 역할 부족은 403, 없는 Conversation은 404, 잘못된 상태 전이는 409다. 실패를 빈 배열로 숨기지 않는다.
