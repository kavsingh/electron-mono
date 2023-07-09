import { osInfo, mem } from "systeminformation";

import { logError } from "~/common/log";

import type { AppEventBus } from "./app-event-bus";

export async function getSystemInfo(): Promise<SystemInfo> {
	const [sysOsInfo, sysMem] = await Promise.all([osInfo(), mem()]);

	return {
		os: sysOsInfo.codename,
		totalMemory: BigInt(sysMem.total),
		freeMemory: BigInt(sysMem.free),
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
			logError(reason);
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
	os: string;
	totalMemory: bigint;
	freeMemory: bigint;
};
