import { app, BrowserWindow } from "electron";

import { createMainWindow } from "./app-windows/main-window";
import { initGraphQl } from "./graphql";
import restrictNavigation from "./lib/restrict-navigation";
import { createAppEventBus } from "./services/app-event-bus";
import { startSystemInfoUpdates } from "./services/system-info";

const appEventBus = createAppEventBus();

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
	stopSystemInfoUpdates = startSystemInfoUpdates(appEventBus);
	initGraphQl();
	showMainWindow();
});

function showMainWindow() {
	const mainWindow = createMainWindow();

	mainWindow.on("ready-to-show", () => {
		mainWindow.show();
	});
}
