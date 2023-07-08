import { getSystemInfo } from "./system-info";

import type { AppEventBus } from "./app-event-bus";

export function startHeartbeat(eventBus: AppEventBus) {
	let active = true;
	let timeout: NodeJS.Timeout | undefined = undefined;

	function tick() {
		if (!active) return;

		void getSystemInfo().then((info) => {
			if (!active) return;

			eventBus.emit("app/heartbeatEvent", info);
			timeout = setTimeout(tick, 1200);
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
