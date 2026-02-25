import { osInfo } from "systeminformation";

import { SystemInfo } from "#common/schema/system.ts";

export async function getSystemInfo(): Promise<SystemInfo> {
	const sysOsInfo = await osInfo();

	return {
		osName: sysOsInfo.codename,
		osVersion: sysOsInfo.release,
		osArch: sysOsInfo.arch,
	};
}
