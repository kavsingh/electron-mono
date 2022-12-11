import { osInfo, mem } from "systeminformation";

import type { Requests } from "~/bridge/types";

export const getSystemInfo = async (): Promise<
	ReturnType<Requests["getSystemInfo"]>
> => {
	const [sysOsInfo, sysMem] = await Promise.all([osInfo(), mem()]);

	return {
		os: sysOsInfo.codename,
		totalMemory: BigInt(sysMem.total),
		freeMemory: BigInt(sysMem.free),
	};
};
