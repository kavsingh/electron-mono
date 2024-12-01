import { app, BrowserWindow } from "electron";

import log from "electron-log";

import { createMainWindow } from "./app-windows/main-window";
import initLogging from "./lib/init-logging";
import restrictNavigation from "./lib/restrict-navigation";
import { createAppEventBus } from "./services/app-event-bus";
import { startSystemStatsUpdates } from "./services/system-stats";
import { setupIpc } from "./tipc";

initLogging();

const appEventBus = createAppEventBus();
let ipcCleanup: ReturnType<typeof setupIpc> | undefined = undefined;
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

	ipcCleanup?.();
	stopSystemStatsUpdates?.();
});

app.enableSandbox();
void app.whenReady().then(() => {
	log.info("App ready");

	ipcCleanup = setupIpc(appEventBus);
	stopSystemStatsUpdates = startSystemStatsUpdates(appEventBus);

	showMainWindow();
});

function showMainWindow() {
	log.info("Showing main window");

	const mainWindow = createMainWindow();

	mainWindow.on("ready-to-show", () => {
		mainWindow.show();
	});
}
