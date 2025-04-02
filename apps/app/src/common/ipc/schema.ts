import {
	defineElectronTypedIpcSchema,
	query,
	mutation,
	sendFromMain,
} from "@kavsingh/electron-typed-ipc";

import type { ThemeSource } from "#common/lib/theme";
// eslint-disable-next-line import-x/no-restricted-paths
import type { SystemInfo } from "#main/services/system-info";
// eslint-disable-next-line import-x/no-restricted-paths
import type { SystemStats } from "#main/services/system-stats";
import type { OpenDialogOptions, OpenDialogReturnValue } from "electron";

export const appIpcSchema = defineElectronTypedIpcSchema({
	showOpenDialog: mutation<OpenDialogReturnValue, OpenDialogOptions>(),
	getThemeSource: query<ThemeSource>(),
	setThemeSource: mutation<ThemeSource, ThemeSource>(),
	getSystemInfo: query<SystemInfo>(),
	getSystemStats: query<SystemStats>(),
	// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	throwCustomError: mutation<void>(),
	systemStatsEvent: sendFromMain<SystemStats>(),
} as const);

export type AppIpcSchema = typeof appIpcSchema;
