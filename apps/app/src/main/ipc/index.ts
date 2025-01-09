import { BrowserWindow, dialog, ipcMain, nativeTheme } from "electron";

import { createTypedIpcMain } from "electron-typed-ipc/main";

import CustomError from "#common/errors/custom-error";
import { serializer } from "#common/ipc/serializer";
import { getSystemInfo } from "#main/services/system-info";
import { getSystemStats } from "#main/services/system-stats";

import type { AppIpcDefinition } from "#common/ipc/definition";
import type { AppEventBus } from "#main/services/app-event-bus";
import type { SystemStats } from "#main/services/system-stats";

const appIpc = createTypedIpcMain<AppIpcDefinition>(ipcMain, { serializer });

export function setupIpc(eventBus: AppEventBus) {
	const handlers = [
		appIpc.showOpenDialog.handleMutation((_, input) => {
			const focusedWindow = BrowserWindow.getAllWindows().find((win) =>
				win.isFocused(),
			);

			if (!focusedWindow) {
				throw new Error("No focused window");
			}

			return dialog.showOpenDialog(focusedWindow, input);
		}),

		appIpc.getSystemInfo.handleQuery(() => getSystemInfo()),

		appIpc.getSystemStats.handleQuery(() => getSystemStats()),

		appIpc.getThemeSource.handleQuery(() => nativeTheme.themeSource),

		appIpc.setThemeSource.handleMutation((_, themeSource) => {
			nativeTheme.themeSource = themeSource;

			return nativeTheme.themeSource;
		}),

		appIpc.throwCustomError.handleMutation(() => {
			throw new CustomError("CODE_A", "something happened");
		}),
	];

	function handleStats(stats: SystemStats) {
		appIpc.systemStatsEvent.send(stats);
	}

	eventBus.addListener("systemStats", handleStats);

	return function cleanup() {
		handlers.forEach((remove) => {
			remove();
		});

		eventBus.removeListener("systemStats", handleStats);
	};
}
