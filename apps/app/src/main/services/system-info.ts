import log from "electron-log";
import { osInfo, mem } from "systeminformation";

import type { AppEventBus } from "./app-event-bus";

export async function getSystemInfo(): Promise<SystemInfo> {
	const [sysOsInfo, sysMem] = await Promise.all([osInfo(), mem()]);

	return {
		osName: sysOsInfo.codename,
		osVersion: sysOsInfo.release,
		osArch: sysOsInfo.arch,
		memTotal: String(sysMem.total),
		memAvailable: String(sysMem.available),
	};
}

export function startSystemInfoUpdates(eventBus: AppEventBus) {
	let active = true;
	let timeout: NodeJS.Timeout | undefined = undefined;

	async function tick() {
		if (!active) return;

		try {
			eventBus.emit("systemInfo", await getSystemInfo());
		} catch (reason) {
			log.error(reason);
		} finally {
			timeout = setTimeout(() => void tick(), 1000);
		}
	}

	void tick();

	return function stopSystemInfoUpdates() {
		active = false;

		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
	};
}

export type SystemInfo = {
	osName: string;
	osVersion: string;
	osArch: string;
	memTotal: string;
	memAvailable: string;
};
