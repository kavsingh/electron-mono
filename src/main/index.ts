import { app, BrowserWindow } from "electron";

import { setupIpcHandlers } from "./ipc";
import { attachHeartbeat } from "./pubsub";
import { createMainWindow } from "./windows";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) app.quit();

const cleanupIpcHandlers = setupIpcHandlers();
let mainWindow: BrowserWindow;
let detachHeartbeat: ReturnType<typeof attachHeartbeat>;

const showMainWindow = () => {
  detachHeartbeat?.();
  mainWindow = createMainWindow();
  detachHeartbeat = attachHeartbeat(mainWindow);
};

app.on("ready", showMainWindow);

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) showMainWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    detachHeartbeat?.();
    cleanupIpcHandlers();
    app.quit();
  }
});
