import log from "electron-log";
import { mem } from "systeminformation";

import type { AppEventBus } from "./app-event-bus";

export async function getSystemStats(): Promise<SystemStats> {
	const sysMem = await mem();

	return {
		memTotal: String(sysMem.total),
		memUsed: String(sysMem.active),
		memAvailable: String(sysMem.available),
		sampledAt: String(Date.now()),
	};
}

export function startSystemStatsUpdates(eventBus: AppEventBus) {
	let active = true;
	let timeout: NodeJS.Timeout | undefined = undefined;

	async function tick() {
		if (!active) return;

		try {
			eventBus.emit("systemStats", await getSystemStats());
		} catch (reason) {
			log.error(reason);
		} finally {
			timeout = setTimeout(() => void tick(), 1000);
		}
	}

	void tick();

	return function stopSystemStatsUpdates() {
		active = false;

		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
	};
}

export interface SystemStats {
	memTotal: string;
	memUsed: string;
	memAvailable: string;
	sampledAt: string;
}
