import { BrowserWindow, dialog, ipcMain, nativeTheme } from "electron";

import { createTIPCMain } from "tipc/main";

import CustomError from "#common/errors/custom-error";
import { serializer } from "#common/tipc/serializer";
import { getSystemInfo } from "#main/services/system-info";
import { getSystemStats } from "#main/services/system-stats";

import type { AppTIPC } from "#common/tipc/defintion";
import type { AppEventBus } from "#main/services/app-event-bus";
import type { SystemStats } from "#main/services/system-stats";

const tipc = createTIPCMain<AppTIPC>(ipcMain, { serializer });

export function setupIpc(eventBus: AppEventBus) {
	const remove = [
		tipc.showOpenDialog.handle(async (_, input) => {
			const focusedWindow = BrowserWindow.getAllWindows().find((win) =>
				win.isFocused(),
			);

			if (!focusedWindow) {
				return { result: "error", error: new Error("No focused window") };
			}

			try {
				return {
					result: "ok",
					value: await dialog.showOpenDialog(
						focusedWindow,
						// circumvent exactOptionalPropertyTypes conflict with
						// upstream types
						input,
					),
				};
			} catch (reason) {
				return { result: "error", error: new Error(String(reason)) };
			}
		}),

		tipc.getSystemInfo.handle(async () => {
			return Math.random() > 0.5
				? { result: "ok", value: await getSystemInfo() }
				: {
						result: "error",
						error: new CustomError("CODE_A", "something happened"),
					};
		}),

		tipc.getSystemStats.handle(async () => {
			try {
				return { result: "ok", value: await getSystemStats() };
			} catch (reason) {
				return { result: "error", error: new Error(String(reason)) };
			}
		}),

		tipc.getThemeSource.handle(() => {
			return { result: "ok", value: nativeTheme.themeSource };
		}),

		tipc.setThemeSource.handle((_, themeSource) => {
			nativeTheme.themeSource = themeSource;

			return { result: "ok", value: nativeTheme.themeSource };
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
