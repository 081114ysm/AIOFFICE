# AI Office Agent System

## 역할 계약

| role | 책임 | 산출물 |
|---|---|---|
| PM | 요청 해석·Task 분해·할당·조정 | 계획 JSON, Task 목록 |
| RESEARCH | 조사·근거 정리 | 근거 있는 조사 결과 |
| DEVELOPER | 구현 계획·결과 작성 | 변경 계획, 결과 요약 |
| QA | 완료 조건 검증·결함 보고 | PASS/FAIL, evidence |

역할은 프롬프트 문자열이 아니라 DB의 `role`, `capabilities`, `system_prompt_version`, `status`다.

## Agent Run

```json
{"runId":"uuid","agentId":"uuid","taskId":"uuid","inputContext":{},"model":"gpt-5","promptVersion":"v1","status":"RUNNING","output":{},"error":null,"startedAt":"ISO-8601","completedAt":null,"tokenUsage":{}}
```

## 실행 규칙

1. Task가 `READY`인지 확인한다.
2. 모든 dependency가 `DONE`인지 확인한다.
3. 활성 Run 중복을 차단한다.
4. `project summary → task → dependency result → recent messages → memories → meeting decisions` 순서로 Context를 만든다.
5. Agent adapter를 호출하고 JSON Schema로 출력 검증한다.
6. 결과·token usage를 저장한다.
7. 성공은 `IN_REVIEW`, 실패는 `FAILED`로 저장한다.
8. QA와 CEO Approval 없이는 `DONE`으로 바꾸지 않는다.

## 상태 표현

`IDLE`은 책상 대기, `WORKING`은 작업 중, `MEETING`은 회의, `WAITING`은 승인·의존성 대기, `OFFLINE`은 연결 불가로 Pixel Office에 표시한다. 상태는 DB Event에서 나온다.

## 프롬프트 안전

System prompt와 사용자 Context를 분리한다. 사용자 메시지·외부 문서가 system rule을 덮어쓰지 못한다. V1 Agent는 외부 파일·코드·GitHub를 조작하지 않는다. V2 Tool은 capability와 Approval을 통과해야 한다.
