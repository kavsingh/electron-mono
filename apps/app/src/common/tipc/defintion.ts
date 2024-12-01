import type { ThemeSource } from "#common/lib/theme";
// eslint-disable-next-line import-x/no-restricted-paths
import type { SystemInfo } from "#main/services/system-info";
// eslint-disable-next-line import-x/no-restricted-paths
import type { SystemStats } from "#main/services/system-stats";
import type { OpenDialogOptions, OpenDialogReturnValue } from "electron";
import type { TIPCDefinitions } from "tipc";

export type AppTIPCDefinitions = TIPCDefinitions<TIPCInvoke, TIPCEventsMain>;

type TIPCInvoke = {
	showOpenDialog: [OpenDialogOptions, OpenDialogReturnValue];
	getThemeSource: [undefined, ThemeSource];
	setThemeSource: [ThemeSource, ThemeSource];
	getSystemInfo: [undefined, SystemInfo];
	getSystemStats: [undefined, SystemStats];
};

type TIPCEventsMain = {
	systemStatsEvent: SystemStats;
};
