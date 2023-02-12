import { initTRPC } from "@trpc/server";
import { observable } from "@trpc/server/observable";

import { heartbeatEmitter } from "../services/heartbeat";
import { getSystemInfo } from "../services/system-info";

import type { HeartbeatEventMap } from "../services/heartbeat";

const trpc = initTRPC.create();

export const appRouter = trpc.router({
	systemInfo: trpc.procedure.query(() => getSystemInfo()),
	heartbeat: trpc.procedure.subscription(() =>
		observable<HeartbeatPayload>((emit) => {
			const handler: HeartbeatHandler = (payload) => {
				emit.next(payload);
			};

			heartbeatEmitter.on("heartbeat", handler);

			return function unsubscribe() {
				heartbeatEmitter.off("heartbeat", handler);
			};
		}),
	),
});

export type AppRouter = typeof appRouter;

type HeartbeatHandler = HeartbeatEventMap["heartbeat"];
type HeartbeatPayload = Parameters<HeartbeatHandler>[0];
