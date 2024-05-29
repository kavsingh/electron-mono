import mockCreator from "./mock-creator";

// eslint-disable-next-line import/no-restricted-paths
import type { SystemInfo } from "#main/services/system-info";

export const createMockSystemInfo = mockCreator<SystemInfo>({
	osName: "OS Name",
	osArch: "OS Arch",
	osVersion: "OS Version",
	memAvailable: String(1024 * 1024), // 1 MB
	memTotal: String(1024 * 1024 * 1024), // 1 GB
});
