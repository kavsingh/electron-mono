import type { AppEventBus } from "./app-event-bus";

export function startHeartbeat(eventBus: AppEventBus) {
	let active = true;
	let timeout: NodeJS.Timeout | undefined = undefined;

	function tick() {
		if (!active) return;

		eventBus.emit("heartbeat", { timestamp: Date.now() });
		timeout = setTimeout(tick, 5000);
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
