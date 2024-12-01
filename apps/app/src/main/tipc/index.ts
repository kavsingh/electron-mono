import { BrowserWindow, dialog, ipcMain, nativeTheme } from "electron";

import { createTIPCMain } from "tipc/main";

import { getSystemInfo } from "#main/services/system-info";
import { getSystemStats } from "#main/services/system-stats";

import type { AppTIPC } from "#common/tipc/defintion";
import type { AppEventBus } from "#main/services/app-event-bus";
import type { SystemStats } from "#main/services/system-stats";

const tipc = createTIPCMain<AppTIPC>(ipcMain);

export function setupIpc(eventBus: AppEventBus) {
	const remove = [
		tipc.showOpenDialog.handle((_, input) => {
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
		}),

		tipc.getSystemInfo.handle(() => getSystemInfo()),

		tipc.getSystemStats.handle(() => getSystemStats()),

		tipc.getThemeSource.handle(() => nativeTheme.themeSource),

		tipc.setThemeSource.handle((_, themeSource) => {
			nativeTheme.themeSource = themeSource;

			return nativeTheme.themeSource;
		}),
	];

	function handleStats(stats: SystemStats) {
		tipc.systemStatsEvent.send(BrowserWindow.getAllWindows(), stats);
	}

	eventBus.addListener("systemStats", handleStats);

	remove.push(() => {
		eventBus.removeListener("systemStats", handleStats);
	});

	return function cleanup() {
		for (const item of remove) item();
	};
}
