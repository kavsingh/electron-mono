import { app, BrowserWindow } from "electron";
import usbDetection from "usb-detection";

import { setupResponders } from "./ipc/responders";
import { attachHeartbeat, attachUsbDetection } from "./ipc/pubsub";
import { createMainWindow } from "./windows";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) app.quit();

const removeResponders = setupResponders();
let mainWindow: BrowserWindow;
let detachHeartbeat: ReturnType<typeof attachHeartbeat>;
let detachUsbDetection: ReturnType<typeof attachUsbDetection>;

const showMainWindow = () => {
  detachHeartbeat?.();
  mainWindow = createMainWindow();
  detachHeartbeat = attachHeartbeat(mainWindow);
  detachUsbDetection = attachUsbDetection(mainWindow);
};

app.on("ready", () => {
  usbDetection.startMonitoring();
  showMainWindow();
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) showMainWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("will-quit", () => {
  usbDetection.stopMonitoring();
  detachHeartbeat?.();
  detachUsbDetection?.();
  removeResponders();
});
