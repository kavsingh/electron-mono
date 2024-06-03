import { osInfo } from "systeminformation";

export async function getSystemInfo(): Promise<SystemInfo> {
	const sysOsInfo = await osInfo();

	return {
		osName: sysOsInfo.codename,
		osVersion: sysOsInfo.release,
		osArch: sysOsInfo.arch,
	};
}

export type SystemInfo = {
	osName: string;
	osVersion: string;
	osArch: string;
};
