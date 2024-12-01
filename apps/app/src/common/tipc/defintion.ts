import type { ThemeSource } from "#common/lib/theme";
// eslint-disable-next-line import-x/no-restricted-paths
import type { SystemInfo } from "#main/services/system-info";
// eslint-disable-next-line import-x/no-restricted-paths
import type { SystemStats } from "#main/services/system-stats";
import type { OpenDialogOptions, OpenDialogReturnValue } from "electron";
import type { TIPCDefinitions } from "tipc";

export type AppTIPCDefinitions = TIPCDefinitions<TIPCInvoke, TIPCEventsMain>;

type TIPCInvoke = {
	showOpenDialog: [arg: OpenDialogOptions, result: OpenDialogReturnValue];
	getThemeSource: [arg: undefined, result: ThemeSource];
	setThemeSource: [arg: ThemeSource, result: ThemeSource];
	getSystemInfo: [arg: undefined, result: SystemInfo];
	getSystemStats: [arg: undefined, result: SystemStats];
};

type TIPCEventsMain = {
	systemStatsEvent: SystemStats;
};
