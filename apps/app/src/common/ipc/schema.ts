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
	getThemeSource: query<ThemeSource, undefined>(),
	setThemeSource: mutation<ThemeSource, ThemeSource>(),
	getSystemInfo: query<SystemInfo, undefined>(),
	getSystemStats: query<SystemStats, undefined>(),
	throwCustomError: mutation<undefined, undefined>(),
	systemStatsEvent: sendFromMain<SystemStats>(),
} as const);

export type AppIpcSchema = typeof appIpcSchema;
