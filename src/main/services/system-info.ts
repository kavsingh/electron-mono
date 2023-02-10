import { osInfo, mem } from "systeminformation";

export async function getSystemInfo(): Promise<SystemInfo> {
	const [sysOsInfo, sysMem] = await Promise.all([osInfo(), mem()]);

	return {
		os: sysOsInfo.codename,
		totalMemory: BigInt(sysMem.total),
		freeMemory: BigInt(sysMem.free),
	};
}

export type SystemInfo = {
	os: string;
	totalMemory: bigint;
	freeMemory: bigint;
};
