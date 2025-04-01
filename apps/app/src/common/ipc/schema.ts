import type { ThemeSource } from "#common/lib/theme";
// eslint-disable-next-line import-x/no-restricted-paths
import type { SystemInfo } from "#main/services/system-info";
// eslint-disable-next-line import-x/no-restricted-paths
import type { SystemStats } from "#main/services/system-stats";
import type {
	DefineElectronTypedIpcSchema,
	ElectronTypedIpcQuery,
	ElectronTypedIpcMutation,
	ElectronTypedIpcSendFromMain,
} from "@kavsingh/electron-typed-ipc";
import type { OpenDialogOptions, OpenDialogReturnValue } from "electron";

export type AppIpcDefinition = DefineElectronTypedIpcSchema<{
	showOpenDialog: ElectronTypedIpcMutation<
		OpenDialogReturnValue,
		OpenDialogOptions
	>;
	getThemeSource: ElectronTypedIpcQuery<ThemeSource>;
	setThemeSource: ElectronTypedIpcMutation<ThemeSource, ThemeSource>;
	getSystemInfo: ElectronTypedIpcQuery<SystemInfo>;
	getSystemStats: ElectronTypedIpcQuery<SystemStats>;
	throwCustomError: ElectronTypedIpcMutation<void>;
	systemStatsEvent: ElectronTypedIpcSendFromMain<SystemStats>;
}>;
