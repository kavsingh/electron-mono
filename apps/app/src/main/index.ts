import { app, BrowserWindow } from "electron";

import log from "electron-log";
import { createIPCHandler } from "trpc-electron/main";

import { createMainWindow } from "./app-windows/main-window";
import initLogging from "./lib/init-logging";
import restrictNavigation from "./lib/restrict-navigation";
import { createAppEventBus } from "./services/app-event-bus";
import { startSystemStatsUpdates } from "./services/system-stats";
import { createAppRouter } from "./trpc/router";

initLogging();

const appEventBus = createAppEventBus();
let trpcIpcHandler: ReturnType<typeof createIPCHandler> | undefined = undefined;
let stopSystemStatsUpdates:
	| ReturnType<typeof startSystemStatsUpdates>
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

	stopSystemStatsUpdates?.();
});

app.enableSandbox();
void app.whenReady().then(() => {
	log.info("App ready");

	trpcIpcHandler = createIPCHandler({ router: createAppRouter(appEventBus) });
	stopSystemStatsUpdates = startSystemStatsUpdates(appEventBus);
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
