# AI Office Desktop Overlay

Electron이 웹의 `/overlay` 화면을 투명한 항상 위 창으로 띄운다.

## 실행

1. API 실행: `npm --prefix ../api run start:dev`
2. 웹 실행: `npm --prefix ../web run dev`
3. 데스크톱 실행: `npm install && npm run dev`

`Command/Ctrl + Shift + O`로 Overlay를 숨기거나 다시 표시한다. 창은 클릭을 통과시키므로 실제 바탕화면 작업을 방해하지 않는다.

