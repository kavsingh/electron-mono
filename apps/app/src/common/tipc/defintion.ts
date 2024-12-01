import type { ThemeSource } from "#common/lib/theme";
// eslint-disable-next-line import-x/no-restricted-paths
import type { SystemInfo } from "#main/services/system-info";
// eslint-disable-next-line import-x/no-restricted-paths
import type { SystemStats } from "#main/services/system-stats";
import type { OpenDialogOptions, OpenDialogReturnValue } from "electron";
import type { DefineTIPC, TIPCInvoke, TIPCSendMain } from "tipc";

export type AppTIPC = DefineTIPC<{
	showOpenDialog: TIPCInvoke<OpenDialogReturnValue, OpenDialogOptions>;
	getThemeSource: TIPCInvoke<ThemeSource>;
	setThemeSource: TIPCInvoke<ThemeSource, ThemeSource>;
	getSystemInfo: TIPCInvoke<SystemInfo>;
	getSystemStats: TIPCInvoke<SystemStats>;
	systemStatsEvent: TIPCSendMain<SystemStats>;
}>;
