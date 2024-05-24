import { app, BrowserWindow } from "electron";
import log from "electron-log";
import { createIPCHandler } from "electron-trpc/main";

import { createMainWindow } from "./app-windows/main-window";
import initLogging from "./lib/init-logging";
import restrictNavigation from "./lib/restrict-navigation";
import { createAppEventBus } from "./services/app-event-bus";
import { startSystemInfoUpdates } from "./services/system-info";
import { createAppRouter } from "./trpc/router";

initLogging();

const appEventBus = createAppEventBus();
let trpcIpcHandler: ReturnType<typeof createIPCHandler> | undefined = undefined;
let stopSystemInfoUpdates:
	| ReturnType<typeof startSystemInfoUpdates>
	| undefined = undefined;

app.on("activate", () => {
	log.info("App activated");

	if (BrowserWindow.getAllWindows().length === 0) showMainWindow();
});

app.on("web-contents-created", (_, contents) => {
	restrictNavigation(contents);
});

app.on("window-all-closed", () => {
	log.info("All app windows closed");

	if (process.platform !== "darwin") app.quit();
});

app.on("quit", () => {
	log.info("App quitting");

	stopSystemInfoUpdates?.();
});

app.enableSandbox();
void app.whenReady().then(() => {
	log.info("App ready");

	trpcIpcHandler = createIPCHandler({ router: createAppRouter(appEventBus) });
	stopSystemInfoUpdates = startSystemInfoUpdates(appEventBus);
	showMainWindow();
});

function showMainWindow() {
	log.info("Showing main window");

	const mainWindow = createMainWindow();

	mainWindow.on("ready-to-show", () => {
		trpcIpcHandler?.attachWindow(mainWindow);
		mainWindow.show();
	});

	mainWindow.on("close", () => {
		trpcIpcHandler?.detachWindow(mainWindow);
	});
}
