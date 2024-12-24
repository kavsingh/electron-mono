import type { ThemeSource } from "#common/lib/theme";
// eslint-disable-next-line import-x/no-restricted-paths
import type { SystemInfo } from "#main/services/system-info";
// eslint-disable-next-line import-x/no-restricted-paths
import type { SystemStats } from "#main/services/system-stats";
import type { OpenDialogOptions, OpenDialogReturnValue } from "electron";
import type {
	DefineTIPC,
	TIPCInvokeQuery,
	TIPCInvokeMutation,
	TIPCSendMain,
} from "tipc";

export type AppTIPC = DefineTIPC<{
	showOpenDialog: TIPCInvokeMutation<OpenDialogReturnValue, OpenDialogOptions>;
	getThemeSource: TIPCInvokeQuery<ThemeSource>;
	setThemeSource: TIPCInvokeMutation<ThemeSource, ThemeSource>;
	getSystemInfo: TIPCInvokeQuery<SystemInfo>;
	getSystemStats: TIPCInvokeQuery<SystemStats>;
	systemStatsEvent: TIPCSendMain<SystemStats>;
}>;
