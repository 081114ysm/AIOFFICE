# AI Office Agent System

## Agent 역할

- `PM`: 요청 해석, Task 분해·할당, 진행 조정
- `RESEARCH`: 자료 조사와 요구사항 근거 정리
- `DEVELOPER`: 구현 계획과 결과 작성
- `QA`: 완료 조건 검증과 결함 보고

역할은 프롬프트 문자열이 아니라 `capabilities`, `system_prompt_version`, `status`를 가진 데이터다. V1에서는 Tool 권한 없이 내부 Context와 다른 Agent 결과만 사용한다.

## Agent Run

Agent 실행은 반드시 다음 정보를 저장한다: `runId`, `agentId`, `taskId`, 입력 Context, 모델, prompt version, 시작·종료 시각, 상태, 출력, 오류, token usage.

```text
READY Task
  → Context assemble
  → Agent adapter call
  → output validate
  → result persist
  → Task/Event update
```

## 실행 규칙

1. 의존 Task가 모두 `DONE`이어야 `READY`가 된다.
2. 한 Task에 동시에 활성 Run을 둘 이상 만들지 않는다.
3. AI 출력은 JSON Schema로 검증한다.
4. 검증 실패는 자동 재시도하되 횟수 제한을 둔다.
5. 상태 변경과 결과 저장은 한 트랜잭션에서 처리한다.
6. Agent가 완료를 선언해도 QA와 CEO Approval을 건너뛸 수 없다.

## Context 구성

`project summary + current task + dependency results + recent conversation messages + relevant memories + meeting decisions` 순서로 구성한다. 전체 대화를 매번 넣는 것은 비용과 노이즈를 동시에 키우므로 Summary와 최근 메시지 윈도우를 사용한다.

## V1 안전 경계

외부 파일 수정·코드 실행·GitHub 변경은 금지한다. V2 Tool System에서 별도 권한과 Approval을 붙인 뒤 허용한다. Agent가 사용자 입력에 포함된 지시로 시스템 규칙을 덮어쓰지 않도록 system prompt와 사용자 Context를 분리한다.

