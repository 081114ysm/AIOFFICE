const { app, BrowserWindow, Notification, globalShortcut, ipcMain } = require("electron");
const path = require("node:path");
const { ReadOnlyAgentRunner } = require("./agent-runner.cjs");

const overlayUrl = process.env.AI_OFFICE_OVERLAY_URL || "http://localhost:3000/overlay";
let overlayWindow;
let agentRunner;

function createOverlay() {
  overlayWindow = new BrowserWindow({ transparent: true, frame: false, resizable: false, movable: false, fullscreen: true, alwaysOnTop: true, skipTaskbar: true, hasShadow: false, webPreferences: { contextIsolation: true, sandbox: true, preload: path.join(__dirname, "preload.cjs") } });
  overlayWindow.setAlwaysOnTop(true, "floating");
  overlayWindow.setIgnoreMouseEvents(true, { forward: true });
  overlayWindow.loadURL(overlayUrl);
  overlayWindow.on("closed", () => { overlayWindow = null; });
}

app.whenReady().then(() => {
  if (process.env.AI_OFFICE_AUTO_START === "true" && process.platform === "darwin") app.setLoginItemSettings({ openAtLogin: true, args: ["--auto-start"] });
  agentRunner = new ReadOnlyAgentRunner({ workspaceRoot: process.env.WORKSPACE_ROOT || path.resolve(__dirname, "../.."), onEvent: (event) => overlayWindow?.webContents.send("agent:event", event) });
  ipcMain.handle("agent:start-readonly", (_event, request) => agentRunner.start(request));
  ipcMain.handle("agent:stop", (_event, id) => agentRunner.stop(id));
  ipcMain.on("notification:completion", (_event, payload) => { if (Notification.isSupported()) new Notification({ title: String(payload?.title || "AI Office"), body: String(payload?.body || "작업이 완료되었습니다.") }).show(); });
  createOverlay();
  globalShortcut.register("CommandOrControl+Shift+O", () => overlayWindow?.isVisible() ? overlayWindow.hide() : overlayWindow?.show());
});
app.on("will-quit", () => globalShortcut.unregisterAll());
app.on("window-all-closed", (event) => event.preventDefault());
