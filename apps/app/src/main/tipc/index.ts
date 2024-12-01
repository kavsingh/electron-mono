import { BrowserWindow, dialog, ipcMain, nativeTheme } from "electron";

import { createTIPCMain } from "tipc/main";

import { getSystemInfo } from "#main/services/system-info";
import { getSystemStats } from "#main/services/system-stats";

import type { AppTIPCDefinitions } from "#common/tipc/defintion";
import type { AppEventBus } from "#main/services/app-event-bus";

const tipc = createTIPCMain<AppTIPCDefinitions>(ipcMain);

export function setupIpc(eventBus: AppEventBus) {
	tipc.handle.showOpenDialog((_, input) => {
		const focusedWindow = BrowserWindow.getAllWindows().find((win) =>
			win.isFocused(),
		);

		if (!focusedWindow) throw new Error("No focused window");

		return dialog.showOpenDialog(
			focusedWindow,
			// circumvent exactOptionalPropertyTypes conflict with
			// upstream types
			input,
		);
	});

	tipc.handle.getSystemInfo(() => getSystemInfo());

	tipc.handle.getSystemStats(() => getSystemStats());

	tipc.handle.getThemeSource(() => nativeTheme.themeSource);

	tipc.handle.setThemeSource((_, themeSource) => {
		nativeTheme.themeSource = themeSource;

		return nativeTheme.themeSource;
	});

	eventBus.addListener("systemStats", (event) => {
		tipc.publish.systemStatsEvent(BrowserWindow.getAllWindows(), event);
	});
}
