import { BrowserWindow, dialog, nativeTheme } from "electron";

import { createElectronTypedIpcMain } from "@kavsingh/electron-typed-ipc/main";

import CustomError from "#common/errors/custom-error";
import { appIpcSchema } from "#common/ipc/schema";
import { serializer } from "#common/ipc/serializer";
import { getSystemInfo } from "#main/services/system-info";
import { getSystemStats } from "#main/services/system-stats";

import type { AppEvent, AppEventBus } from "#main/services/app-event-bus";

const { ipcHandleAndSend } = createElectronTypedIpcMain(appIpcSchema, {
	serializer,
});

export function setupIpc(eventBus: AppEventBus) {
	return ipcHandleAndSend({
		getSystemInfo,

		getSystemStats,

		showOpenDialog: (_, input) => {
			const focusedWindow = BrowserWindow.getAllWindows().find((win) =>
				win.isFocused(),
			);

			if (!focusedWindow) {
				throw new Error("No focused window");
			}

			return dialog.showOpenDialog(focusedWindow, input);
		},

		getThemeSource: () => nativeTheme.themeSource,

		setThemeSource: (_, themeSource) => {
			nativeTheme.themeSource = themeSource;

			return nativeTheme.themeSource;
		},

		throwCustomError: () => {
			throw new CustomError("CODE_A", "something happened");
		},

		systemStatsEvent: ({ send }) => {
			function handleStats(payload: AppEvent<"systemStats">) {
				send({ payload });
			}

			eventBus.addListener("systemStats", handleStats);

			return () => {
				eventBus.removeListener("systemStats", handleStats);
			};
		},
	});
}
