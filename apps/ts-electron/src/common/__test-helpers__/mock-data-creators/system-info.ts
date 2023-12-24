import mockCreator from "./mock-creator";

// @type-only import
// eslint-disable-next-line import/no-restricted-paths
import type { SystemInfo } from "#main/services/system-info";

export const createMockSystemInfo = mockCreator<SystemInfo>({
	osName: "osName",
	osArch: "osArch",
	osVersion: "osVersion",
	memTotal: BigInt(10_000_000_000),
	memAvailable: BigInt(1_000_000_000),
});
