# AI Office

AI Agent를 직원처럼 운영하는 가상 회사 플랫폼.

## 문서

- [PROJECT_SPEC.md](./PROJECT_SPEC.md): 전체 기획 원문
- [docs/V1_MVP.md](./docs/V1_MVP.md): V1 범위와 완료 조건
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md): 시스템 구조
- [docs/DATABASE.md](./docs/DATABASE.md): 데이터 모델과 제약
- [docs/AGENT_SYSTEM.md](./docs/AGENT_SYSTEM.md): Agent 실행 규칙
- [docs/MEETING_SYSTEM.md](./docs/MEETING_SYSTEM.md): 회의·Decision 흐름
- [docs/CONVERSATION_SYSTEM.md](./docs/CONVERSATION_SYSTEM.md): Conversation·Resume 흐름

프론트 상태관리는 Zustand를 사용하며, 구체적인 경계는 [ARCHITECTURE.md](./docs/ARCHITECTURE.md)에 정의한다.

## 디렉터리

```text
apps/web       Next.js 프론트엔드
apps/api       NestJS 백엔드
packages/shared 공통 타입·Event 계약
```

## 시작점

V1 구현은 `docs/V1_MVP.md`의 구현 순서를 따른다. 현재 골격은 도메인 경계를 먼저 고정한 상태이며, 데이터베이스와 AI Provider는 다음 구현 단계에서 연결한다.

## 로컬 실행

```bash
cd /Users/081114ysm/Desktop/Project/AIOFFICE
npm --prefix apps/api run start:dev
```

API 확인:

```bash
curl http://localhost:4000/health
curl http://localhost:4000/api/state
```

프론트엔드는 별도 터미널에서 의존성을 설치한 뒤 실행한다.

```bash
npm --prefix apps/web install
npm --prefix apps/web run dev
```

바탕화면 Overlay는 API와 웹을 먼저 실행한 뒤 Electron 래퍼를 실행한다.

```bash
npm --prefix apps/desktop install
npm run dev:desktop
```

Overlay 창은 투명·항상 위·클릭 통과 방식이며 `Command/Ctrl + Shift + O`로 숨기거나 표시할 수 있다.

## 현재 구현 상태

API는 V1 핵심 흐름을 검증하기 위한 인메모리 실행 버전이다. 서버를 재시작하면 데이터가 초기화된다. 다음 구현 단계에서 Repository를 PostgreSQL로 교체하고, Agent adapter를 실제 AI Provider와 연결한다.
