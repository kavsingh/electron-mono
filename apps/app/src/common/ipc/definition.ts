import type { ThemeSource } from "#common/lib/theme";
// eslint-disable-next-line import-x/no-restricted-paths
import type { SystemInfo } from "#main/services/system-info";
// eslint-disable-next-line import-x/no-restricted-paths
import type { SystemStats } from "#main/services/system-stats";
import type { OpenDialogOptions, OpenDialogReturnValue } from "electron";
import type {
	DefineTypedIpc,
	TypedIpcQuery,
	TypedIpcMutation,
	TypedIpcSendFromMain,
} from "electron-typed-ipc";

export type AppIpcDefinition = DefineTypedIpc<{
	showOpenDialog: TypedIpcMutation<OpenDialogReturnValue, OpenDialogOptions>;
	getThemeSource: TypedIpcQuery<ThemeSource>;
	setThemeSource: TypedIpcMutation<ThemeSource, ThemeSource>;
	getSystemInfo: TypedIpcQuery<SystemInfo>;
	getSystemStats: TypedIpcQuery<SystemStats>;
	throwCustomError: TypedIpcMutation<void>;
	systemStatsEvent: TypedIpcSendFromMain<SystemStats>;
}>;
