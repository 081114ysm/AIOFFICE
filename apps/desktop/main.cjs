const { app, BrowserWindow, globalShortcut } = require("electron");

const overlayUrl = process.env.AI_OFFICE_OVERLAY_URL || "http://localhost:3000/overlay";
let overlayWindow;

function createOverlay() {
  overlayWindow = new BrowserWindow({ transparent: true, frame: false, resizable: false, movable: false, fullscreen: true, alwaysOnTop: true, skipTaskbar: true, hasShadow: false, webPreferences: { contextIsolation: true, sandbox: true } });
  overlayWindow.setAlwaysOnTop(true, "floating");
  overlayWindow.setIgnoreMouseEvents(true, { forward: true });
  overlayWindow.loadURL(overlayUrl);
  overlayWindow.on("closed", () => { overlayWindow = null; });
}

app.whenReady().then(() => {
  if (process.env.AI_OFFICE_AUTO_START === "true" && process.platform === "darwin") app.setLoginItemSettings({ openAtLogin: true, args: ["--auto-start"] });
  createOverlay();
  globalShortcut.register("CommandOrControl+Shift+O", () => overlayWindow?.isVisible() ? overlayWindow.hide() : overlayWindow?.show());
});
app.on("will-quit", () => globalShortcut.unregisterAll());
app.on("window-all-closed", (event) => event.preventDefault());
