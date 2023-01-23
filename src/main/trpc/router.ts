import { EventEmitter } from "events";

import { initTRPC } from "@trpc/server";
import { observable } from "@trpc/server/observable";

import { getSystemInfo } from "../services/system-info";

import type { SystemInfo } from "~/common/trpc/types";

const trpc = initTRPC.create();
const heartbeatEmitter = new EventEmitter();

export const appRouter = trpc.router({
	systemInfo: trpc.procedure.query(() => getSystemInfo()),
	heartbeat: trpc.procedure.subscription(() =>
		observable<SystemInfo>((emit) => {
			const handler = (payload: SystemInfo) => {
				emit.next(payload);
			};

			heartbeatEmitter.on("event", handler);

			return function unsubscribe() {
				heartbeatEmitter.off("event", handler);
			};
		}),
	),
});

export const startHeartbeat = () => {
	let active = true;
	let timeout: NodeJS.Timeout | null = null;

	const tick = () => {
		if (!active) return;

		void getSystemInfo().then((info) => {
			if (active) heartbeatEmitter.emit("event", info);
		});

		timeout = setTimeout(tick, 1000);
	};

	tick();

	return function stopHeartbeat() {
		active = false;

		if (timeout) {
			clearTimeout(timeout);
			timeout = null;
		}
	};
};

export type AppRouter = typeof appRouter;
