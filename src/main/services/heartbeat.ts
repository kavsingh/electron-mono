import EventEmitter from "eventemitter3";

import { getSystemInfo } from "./system-info";

import type { SystemInfo } from "./system-info";

export const heartbeatEmitter = new EventEmitter<HeartbeatEventMap>();

export function startHeartbeat() {
	let active = true;
	let timeout: NodeJS.Timeout | undefined = undefined;

	function tick() {
		if (!active) return;

		void getSystemInfo().then((info) => {
			if (!active) return;

			heartbeatEmitter.emit("heartbeat", info);
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

export type HeartbeatEventMap = {
	heartbeat: (payload: SystemInfo) => void;
};
