import { app, BrowserWindow } from "electron";
import HID from "node-hid";

import { mainHandleRequest } from "@app/bridge/request";
import { mainSendMessage } from "@app/bridge/message";

/*
name MAIN_WINDOW_xxx matches renderer entry points in package.json config/forge:
{
  plugins: [
    [@electron-forge/plugin-webpack, {
      renderer: {
        entryPoints: [
          {
            name: "main_window", <-- Here
            ...
          }
        ]
      }
    }]
  ]
}
*/
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) app.quit();

const createMainWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    titleBarStyle: "hiddenInset",
    webPreferences: { preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.webContents.openDevTools();

  mainHandleRequest("request-hid-devices", async () => HID.devices());
  mainHandleRequest("echo", async (_, ping) => `${ping}... ${ping}... ${ping}`);

  mainWindow.webContents.on("did-frame-finish-load", () => {
    mainSendMessage(mainWindow, "health", { status: "ok" });
  });
};

app.on("ready", createMainWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});
