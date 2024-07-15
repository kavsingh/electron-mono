import mockCreator from "./mock-creator";

// eslint-disable-next-line import-x/no-restricted-paths
import type { SystemInfo } from "#main/services/system-info";
// eslint-disable-next-line import-x/no-restricted-paths
import type { SystemStats } from "#main/services/system-stats";

export const createMockSystemInfo = mockCreator<SystemInfo>({
	osName: "OS Name",
	osVersion: "OS Version",
	osArch: "OS Arch",
});

export const createMockSystemStats = mockCreator<SystemStats>({
	memTotal: String(1024 * 1024 * 1024),
	memUsed: String(1024 * 1024 * 600),
	memAvailable: String(1024 * 1024 * 400),
	sampledAt: "0",
});
