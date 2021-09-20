import { app, BrowserWindow } from "electron";
import HID from "node-hid";

import { mainHandleRequest } from "~/bridge/request";
import { mainSendMessage } from "~/bridge/message";

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

  void mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if (process.env.NODE_ENV !== "production" && !process.env.SPECTRON) {
    mainWindow.webContents.openDevTools();
  }

  let cleanupMessaging: ReturnType<typeof setupMessaging> | null = null;

  mainWindow.webContents.on("dom-ready", () => {
    cleanupMessaging = setupMessaging(mainWindow);
  });

  mainWindow.on("close", () => {
    cleanupMessaging?.();
  });
};

const setupIpcHandlers = () => {
  const removeHidHandler = mainHandleRequest("request-hid-devices", () =>
    Promise.resolve(HID.devices())
  );
  const removeEchoHandler = mainHandleRequest("echo", (_, ping) =>
    Promise.resolve(`${ping}... ${ping}... ${ping}`)
  );

  return () => {
    removeEchoHandler();
    removeHidHandler();
  };
};

const setupMessaging = (win: BrowserWindow) => {
  const healthInterval = setInterval(() => {
    mainSendMessage(win, "health", { status: "ok" });
  }, 2000);

  return () => {
    clearInterval(healthInterval);
  };
};

const cleanupIpcHandlers = setupIpcHandlers();

app.on("ready", createMainWindow);

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});

app.on("window-all-closed", () => {
  if (process.env.SPECTRON || process.platform !== "darwin") {
    cleanupIpcHandlers();
    app.quit();
  }
});
