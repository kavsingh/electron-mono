import { observable } from "@trpc/server/observable";

import showOpenDialog from "./show-open-dialog";
import { publicProcedure, router } from "./trpc-server";
import { heartbeatEmitter } from "../services/heartbeat";
import { getSystemInfo } from "../services/system-info";

import type { HeartbeatEventMap } from "../services/heartbeat";

export const appRouter = router({
	showOpenDialog,
	systemInfo: publicProcedure.query(() => getSystemInfo()),
	heartbeat: publicProcedure.subscription(() =>
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
