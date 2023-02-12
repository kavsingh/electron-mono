import { app, BrowserWindow } from "electron";
import { createIPCHandler } from "electron-trpc/main";

import restrictNavigation from "./lib/restrict-navigation";
import { startHeartbeat } from "./services/heartbeat";
import { appRouter } from "./trpc/router";
import { createMainWindow } from "./windows";

let trpcIpcHandler: ReturnType<typeof createIPCHandler> | undefined = undefined;
let stopHeartbeat: ReturnType<typeof startHeartbeat> | undefined = undefined;

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

app.on("quit", () => {
	stopHeartbeat?.();
});

app.enableSandbox();
void app.whenReady().then(() => {
	trpcIpcHandler = createIPCHandler({ router: appRouter });
	stopHeartbeat = startHeartbeat();
	showMainWindow();
});

function showMainWindow() {
	const mainWindow = createMainWindow();

	mainWindow.on("ready-to-show", () => {
		trpcIpcHandler?.attachWindow(mainWindow);
		mainWindow.show();
	});

	mainWindow.on("closed", () => {
		trpcIpcHandler?.detachWindow(mainWindow);
	});
}
