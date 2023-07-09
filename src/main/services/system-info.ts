import { osInfo, mem } from "systeminformation";

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

	function tick() {
		if (!active) return;

		void getSystemInfo().then((info) => {
			if (!active) return;

			eventBus.emit("systemInfo", info);
			timeout = setTimeout(tick, 1000);
		});
	}

	tick();

	return function stopHeartbeat() {
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
