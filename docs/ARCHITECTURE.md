# AI Office Architecture

## 기준

V1은 모듈형 모놀리스로 시작한다. Agent마다 서버를 따로 띄우는 구조는 확장처럼 보이지만, 초기에는 배포·트랜잭션·디버깅 비용만 키운다. 경계는 코드 모듈과 이벤트로 먼저 나누고, 실제 병목이 확인될 때만 서비스 분리를 검토한다.

## 전체 흐름

```text
Web UI → API → Application Use Case → Domain Module → Repository
                         ↓
                    Event Bus → WebSocket/SSE → Office UI
                         ↓
                    AI Runtime → Agent Adapter
```

## 레이어 책임

- `domain`: Project, Task, Agent, Meeting, Approval의 상태와 규칙. 외부 SDK를 모른다.
- `application`: 사용자 명령과 Agent 실행 시나리오. 트랜잭션 경계를 관리한다.
- `infrastructure`: DB, AI Provider, Event Bus, WebSocket, 외부 Tool Adapter.
- `interfaces`: REST/WebSocket DTO, 인증, 에러 응답.
- `web`: 화면 상태와 서버 데이터 표시. 업무 규칙을 복제하지 않는다.

## 프론트 상태관리

프론트엔드는 Zustand를 단일 클라이언트 store로 사용한다. `useOfficeStore`가 API 호출, 로딩·에러 상태, 현재 Office snapshot, 메시지 draft를 관리하고 화면 컴포넌트는 store selector를 통해 읽는다. Project·Task·Agent 같은 서버 원본을 Zustand persist로 저장하지 않는다. 새로고침·다중 탭의 기준은 API와 DB이며, Zustand는 화면 캐시다.

Overlay 켜짐 여부는 브라우저 localStorage만 믿지 않고 `/api/preferences/overlay`에도 저장한다. 일반 웹 화면과 Electron Overlay 창은 서로 다른 Chromium 저장공간을 사용할 수 있기 때문에, 이 공통 설정이 두 화면을 동기화한다.

```text
API/DB (source of truth)
          ↓ fetchState
Zustand useOfficeStore (client cache + UI state)
          ↓ selector
Dashboard / Task Board / Conversation
```

## 권장 폴더

```text
apps/
  web/                 # Next.js 프론트엔드
  api/                 # Node.js API (V1), 이후 NestJS 전환 가능
  desktop/             # Electron 투명·항상 위 Overlay 창
packages/
  shared/              # DTO, enum, event contract
docs/
PROJECT_SPEC.md        # 전체 기획 원문
```

### 프론트엔드 세부 구조

```text
apps/web/src/
  app/                  # Next.js route entry와 전역 스타일
  components/           # 화면 단위 UI
    dashboard/          # 대시보드 조합·지표
    office/             # Agent/Office 표시
    tasks/              # Task Board
    conversation/       # CEO Conversation
  lib/                  # API client와 외부 연동
  store/                # Zustand client state
  types/                # 프론트 전용 타입
```

### 백엔드 세부 구조

```text
apps/api/src/
  config/               # 환경변수·앱 설정
  common/                # ID, 공통 에러 등
  infrastructure/        # DB adapter와 Event Bus
  modules/               # 기능별 controller/service/repository
    projects/
    tasks/
    conversations/
    meetings/
    approvals/
    health/
  app/                   # 애플리케이션 라우터
  http/                 # Body parser와 응답/CORS
  server.mjs            # HTTP 서버 부트스트랩
```

## 통신 원칙

REST는 생성·조회·명령 요청에 사용한다. 실시간 Office 상태와 실행 로그는 WebSocket 또는 SSE로 전달한다. 클라이언트가 Agent 상태를 직접 바꾸지 않고 `POST /tasks/:id/run`, `POST /meetings`, `POST /approvals/:id/approve` 같은 명령을 보낸다.

## 실패 처리

모든 실행에는 `runId`와 idempotency key를 둔다. AI 응답 파싱 실패, 타임아웃, 재시도 초과는 `FAILED`와 구조화된 Error Event로 남긴다. 화면에서 조용히 멈추는 것은 버그다.
