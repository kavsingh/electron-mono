import { app, BrowserWindow } from "electron";

import { attachSystemInfo, attachNtkDaemonStatus } from "./ipc/pubsub";
import { setupResponders } from "./ipc/responders";
import restrictNavigation from "./lib/restrict-navigation";
import { createMainWindow } from "./windows";

const removeResponders = setupResponders();
let mainWindow: BrowserWindow;
let detachSystemInfo: ReturnType<typeof attachSystemInfo> | undefined;
let detachNtkDaemonStatus: ReturnType<typeof attachNtkDaemonStatus> | undefined;

const showMainWindow = () => {
	mainWindow = createMainWindow();
	detachSystemInfo = attachSystemInfo(mainWindow);
	detachNtkDaemonStatus = attachNtkDaemonStatus(mainWindow);
	mainWindow.on("ready-to-show", () => {
		mainWindow.show();
	});
};

app.on("activate", () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) showMainWindow();
});

app.on("web-contents-created", (_, contents) => {
	restrictNavigation(contents);
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});

app.on("will-quit", () => {
	detachSystemInfo?.();
	detachNtkDaemonStatus?.();
	removeResponders();
});

app.enableSandbox();
void app.whenReady().then(() => {
	showMainWindow();
});
