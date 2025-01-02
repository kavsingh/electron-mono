import { BrowserWindow, dialog, ipcMain, nativeTheme } from "electron";

import { createTIPCMain } from "electron-typed-ipc/main";

import CustomError from "#common/errors/custom-error";
import { serializer } from "#common/tipc/serializer";
import { getSystemInfo } from "#main/services/system-info";
import { getSystemStats } from "#main/services/system-stats";

import type { AppTIPC } from "#common/tipc/definition";
import type { AppEventBus } from "#main/services/app-event-bus";
import type { SystemStats } from "#main/services/system-stats";

const tipc = createTIPCMain<AppTIPC>(ipcMain, { serializer });

export function setupIpc(eventBus: AppEventBus) {
	const handlers = [
		tipc.showOpenDialog.handleMutation((_, input) => {
			const focusedWindow = BrowserWindow.getAllWindows().find((win) =>
				win.isFocused(),
			);

			if (!focusedWindow) {
				throw new Error("No focused window");
			}

			return dialog.showOpenDialog(focusedWindow, input);
		}),

		tipc.getSystemInfo.handleQuery(() => getSystemInfo()),

		tipc.getSystemStats.handleQuery(() => getSystemStats()),

		tipc.getThemeSource.handleQuery(() => nativeTheme.themeSource),

		tipc.setThemeSource.handleMutation((_, themeSource) => {
			nativeTheme.themeSource = themeSource;

			return nativeTheme.themeSource;
		}),

		tipc.throwCustomError.handleMutation(() => {
			throw new CustomError("CODE_A", "something happened");
		}),
	];

	function handleStats(stats: SystemStats) {
		tipc.systemStatsEvent.send(BrowserWindow.getAllWindows(), stats);
	}

	eventBus.addListener("systemStats", handleStats);

	return function cleanup() {
		handlers.forEach((remove) => {
			remove();
		});

		eventBus.removeListener("systemStats", handleStats);
	};
}
