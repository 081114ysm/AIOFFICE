# AI Office Architecture

## 결정

V1은 Node.js 모듈형 모놀리스 + PostgreSQL + Next.js + Zustand + WebSocket으로 구현한다. Agent마다 서버를 분리하지 않고 코드 모듈과 Event Bus로 경계를 만든다.

## 런타임 흐름

```text
Next.js Dashboard / Electron Overlay
 → REST command → Router + Auth/RBAC → Controller
 → Service/Domain rule → PostgreSQL Repository
 → Event Bus → WebSocket broadcast → Zustand cache/refetch
```

## 레이어 규칙

- `controller`: HTTP 입출력만 담당
- `service`: 유스케이스·권한 전제·상태 전이 담당
- `repository`: SQL만 담당
- `infrastructure/database`: Pool·migration·transaction 담당
- `infrastructure/events`: Event 저장·broadcast 담당
- `config`: 환경변수 검증과 기본값
- `web/store`: 서버 원본이 아닌 화면 캐시·draft·UI 설정

## 폴더 계약

```text
apps/api/src/{app,config,common,http,infrastructure,modules}
apps/api/src/modules/{auth,projects,tasks,conversations,meetings,approvals,ai,github,v2}
apps/web/src/{app,components,lib,store,types}
apps/web/src/components/{dashboard,office,activity,tasks,conversation,settings,overlay}
apps/desktop/{main.cjs,package.json}
docs/
```

## 통신 원칙

REST는 생성·조회·명령, WebSocket은 상태 Event 알림에 사용한다. Event 수신 후 snapshot을 재조회하므로 DB가 다중 탭의 기준이다.

Event 필수 필드:

```json
{"id":"uuid","type":"AGENT_RUN_COMPLETED","projectId":"uuid","payload":{},"occurredAt":"ISO-8601"}
```

모든 실행에는 `runId`와 idempotency key를 사용한다. AI 파싱 실패·타임아웃·재시도 초과는 `FAILED` Event로 남긴다.

## 프론트 상태

`useOfficeStore`는 `data`, `v2`, loading/error, message draft, notifications, overlay UI 설정을 관리한다. Project·Task·Agent는 persist하지 않는다. Overlay 설정은 API/DB를 우선하고 localStorage는 보조 캐시다.

## 검증

`npm run typecheck`, `npm run build`, migration, `/health`, 인증 401, 역할 부족 403, WebSocket CONNECTED/Event 수신을 확인한다.
