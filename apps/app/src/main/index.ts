import { app, BrowserWindow, protocol } from "electron";
import log from "electron-log";
import { createIPCHandler } from "trpc-electron/main";

import { createMainWindow } from "./app-windows/main-window.ts";
import { APP_PROTOCOL_SCHEME, appProtocolHandler } from "./lib/app-protocol.ts";
import { initLogging } from "./lib/init-logging.ts";
import { restrictNavigation } from "./lib/restrict-navigation.ts";
import { createAppEventBus } from "./services/app-event-bus.ts";
import { startSystemStatsUpdates } from "./services/system-stats.ts";
import { createAppRouter } from "./trpc/router.ts";

app.enableSandbox();
protocol.registerSchemesAsPrivileged([{ scheme: APP_PROTOCOL_SCHEME }]);
initLogging();

const appEventBus = createAppEventBus();
let trpcIpcHandler: ReturnType<typeof createIPCHandler> | undefined = undefined;
let stopSystemStatsUpdates:
	| ReturnType<typeof startSystemStatsUpdates>
	| undefined = undefined;

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

void app.whenReady().then(() => {
	log.info("App ready");
	protocol.handle(APP_PROTOCOL_SCHEME, appProtocolHandler);
	trpcIpcHandler = createIPCHandler({ router: createAppRouter(appEventBus) });
	stopSystemStatsUpdates = startSystemStatsUpdates(appEventBus);
	showMainWindow();
});
