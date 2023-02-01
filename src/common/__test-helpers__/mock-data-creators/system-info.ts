// type-only import
// eslint-disable-next-line import/no-restricted-paths
import type { SystemInfo } from "~/main/services/system-info";

export const createMockSystemInfo = (
	info: Partial<SystemInfo> = {},
): SystemInfo => ({
	os: "OS",
	totalMemory: BigInt(10_000_000_000),
	freeMemory: BigInt(1_000_000_000),
	...info,
});
