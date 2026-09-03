# AI Office V2 구현 기준

## 목표

V1의 AI 업무 흐름을 실제 프로젝트 작업으로 확장한다. 외부 시스템을 Agent가 직접 조작할 수 있게 하되, 모든 Tool 실행은 권한과 Approval을 거친다.

## 이번 V2 기반 범위

- 여러 Project를 동시에 관리
- Agent roster와 채용 요청
- Tool Registry와 Tool capability
- Tool 실행 요청 → Approval → 실행 결과 흐름
- GitHub·Terminal·File System·MCP를 연결할 Adapter 경계
- Organization과 Agent 소속
- 작업 비용·실행 시간 기록 필드

## 안전 원칙

파일 삭제, 임의 셸, `git push/reset/clean`, 권한 상승 명령은 거부한다. 실제 Adapter는 allowlist, workspace 경로 제한, 보호 파일 차단, timeout, 실행 로그, 사용자 Approval을 모두 통과해야 한다. GitHub Commit/PR은 서버 토큰을 브라우저에 노출하지 않고 승인된 입력만 API로 전달한다.

## V2 상태 흐름

```text
Agent → Tool Run 요청 → 권한 검사 → CEO Approval
     → Real Adapter 실행 → 결과 저장 → Conversation/Event 반영
```
