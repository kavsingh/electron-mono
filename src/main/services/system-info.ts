import { osInfo, mem } from "systeminformation";

import type { SystemInfo } from "~/common/trpc/types";

export const getSystemInfo = async (): Promise<SystemInfo> => {
	const [sysOsInfo, sysMem] = await Promise.all([osInfo(), mem()]);

	return {
		os: sysOsInfo.codename,
		totalMemory: BigInt(sysMem.total),
		freeMemory: BigInt(sysMem.free),
	};
};
