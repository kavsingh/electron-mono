import { osInfo, mem } from "systeminformation";

export const getSystemInfo = async (): Promise<SystemInfo> => {
	const [sysOsInfo, sysMem] = await Promise.all([osInfo(), mem()]);

	return {
		os: sysOsInfo.codename,
		totalMemory: BigInt(sysMem.total),
		freeMemory: BigInt(sysMem.free),
	};
};

export interface SystemInfo {
	os: string;
	totalMemory: bigint;
	freeMemory: bigint;
}
