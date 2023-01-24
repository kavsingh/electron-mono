import { app, BrowserWindow } from "electron";
// @ts-expect-error fucking ESM interop with package exports. switching to type:module + node 16 resolution breaks 100 other things. ignore for now
import { createIPCHandler } from "electron-trpc/main";

import restrictNavigation from "./lib/restrict-navigation";
import { appRouter, startHeartbeat } from "./trpc/router";
import { createMainWindow } from "./windows";

let trpcIpcHandler: ReturnType<typeof createIPCHandler> | undefined = undefined;
let stopHeartbeat: ReturnType<typeof startHeartbeat> | undefined = undefined;

const showMainWindow = () => {
	const mainWindow = createMainWindow();

	mainWindow.on("ready-to-show", () => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
		trpcIpcHandler?.attachWindow(mainWindow);
		mainWindow.show();
	});

	mainWindow.on("closed", () => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
		trpcIpcHandler?.detachWindow(mainWindow);
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

app.on("quit", () => {
	stopHeartbeat?.();
});

app.enableSandbox();
void app.whenReady().then(() => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
	trpcIpcHandler = createIPCHandler({ router: appRouter });
	stopHeartbeat = startHeartbeat();
	showMainWindow();
});
