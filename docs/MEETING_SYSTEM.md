# AI Office Meeting System

## 목적

Task가 막혔거나 여러 Agent의 결정이 필요할 때 구조화된 회의를 만든다. 회의는 장식용 채팅방이 아니라 Decision과 Action Item을 생성하는 도메인 이벤트다.

## 생성 조건

- Agent가 의존성 충돌이나 요구사항 불명확을 보고한 경우
- PM이 여러 역할의 검토가 필요하다고 판단한 경우
- QA가 결함 원인에 대한 재논의를 요청한 경우

## 생명주기

`SCHEDULED → IN_PROGRESS → COMPLETED` 또는 `CANCELLED`

## 회의 데이터

회의에는 `projectId`, 목적, agenda, facilitator, participant agents, 관련 taskIds, transcript, summary, decisions, action items, 시작·종료 시각을 저장한다. Transcript와 최종 요약을 섞지 않는다.

## 진행 흐름

```text
Meeting create → participants load context → round-robin 의견
→ facilitator summary → Decision/Action Item 추출
→ 관련 Task 갱신 → Meeting complete Event
```

## 결정과 후속 작업

Decision은 `question`, `options`, `chosen_option`, `rationale`, `decided_by`, `confidence`를 가진다. 실행 가능한 내용은 반드시 Action Item으로 분리해 담당 Agent·기한·관련 Task를 지정한다. 회의 요약만 저장하고 실제 Task를 만들지 않는 설계는 추적이 끊긴다.

## 실패 처리

참석 Agent 응답 실패는 transcript에 오류 상태로 남기고, 회의 전체를 성공으로 위장하지 않는다. 반복 실패 시 PM이 `BLOCKED` Task와 재회의 필요성을 기록한다.

