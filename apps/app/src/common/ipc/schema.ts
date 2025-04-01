import type { ThemeSource } from "#common/lib/theme";
// eslint-disable-next-line import-x/no-restricted-paths
import type { SystemInfo } from "#main/services/system-info";
// eslint-disable-next-line import-x/no-restricted-paths
import type { SystemStats } from "#main/services/system-stats";
import type {
	DefineElectronTypedIpcSchema,
	Query,
	Mutation,
	SendFromMain,
} from "@kavsingh/electron-typed-ipc";
import type { OpenDialogOptions, OpenDialogReturnValue } from "electron";

export type AppIpcDefinition = DefineElectronTypedIpcSchema<{
	showOpenDialog: Mutation<OpenDialogReturnValue, OpenDialogOptions>;
	getThemeSource: Query<ThemeSource>;
	setThemeSource: Mutation<ThemeSource, ThemeSource>;
	getSystemInfo: Query<SystemInfo>;
	getSystemStats: Query<SystemStats>;
	throwCustomError: Mutation<void>;
	systemStatsEvent: SendFromMain<SystemStats>;
}>;
