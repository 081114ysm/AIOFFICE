# AI Office Desktop Overlay

Electron이 웹의 `/overlay` 화면을 투명한 항상 위 창으로 띄운다.

## 실행

1. API 실행: `npm --prefix ../api run start:dev`
2. 웹 실행: `npm --prefix ../web run dev`
3. 데스크톱 실행: `npm install && npm run dev`

`Command/Ctrl + Shift + O`로 Overlay를 숨기거나 다시 표시한다. 창은 클릭을 통과시키므로 실제 바탕화면 작업을 방해하지 않는다.
Electron 오버레이는 대시보드의 픽셀 오피스를 macOS 데스크톱 위에 표시합니다.

## 안전한 로컬 에이전트 실행

`agent-runner.cjs`는 Electron IPC를 통해 Codex의 읽기 전용 분석 세션만 시작합니다.

- `codex exec --sandbox read-only --ephemeral`만 사용
- `shell: false`로 셸 해석 차단
- 프로젝트 파일 수정, Git push, 임의 터미널 입력은 실행하지 않음
- 결과는 `agent:event` IPC 이벤트로 오버레이에 전달

파일 수정과 터미널 실행은 웹 앱의 승인 DB 기반 도구 흐름을 사용해야 합니다. 데스크톱 프로세스에 무제한 PTY 입력을 연결하면 승인 시스템을 우회하게 되므로 별도 기능으로 넣지 않습니다.
