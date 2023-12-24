import { app, BrowserWindow } from "electron";
import { createIPCHandler } from "electron-trpc/main";

import { createMainWindow } from "./app-windows/main-window";
import restrictNavigation from "./lib/restrict-navigation";
import { createAppEventBus } from "./services/app-event-bus";
import { startSystemInfoUpdates } from "./services/system-info";
import { createAppRouter } from "./trpc/router";

const appEventBus = createAppEventBus();
let trpcIpcHandler: ReturnType<typeof createIPCHandler> | undefined = undefined;
let stopSystemInfoUpdates:
	| ReturnType<typeof startSystemInfoUpdates>
	| undefined = undefined;

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
	stopSystemInfoUpdates?.();
});

app.enableSandbox();
void app.whenReady().then(() => {
	trpcIpcHandler = createIPCHandler({ router: createAppRouter(appEventBus) });
	stopSystemInfoUpdates = startSystemInfoUpdates(appEventBus);
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
