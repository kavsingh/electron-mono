import { observable } from "@trpc/server/observable";

import { getSystemInfo } from "~/main/services/system-info";

import { publicProcedure } from "./trpc-server";

import type { AppEvent, AppEventBus } from "~/main/services/app-event-bus";

export default function routesStatus(eventBus: AppEventBus) {
	return {
		systemInfo: publicProcedure.query(() => getSystemInfo()),

		heartbeat: publicProcedure.subscription(() => {
			type Payload = AppEvent<"app/heartbeatEvent">;

			return observable<Payload>((emit) => {
				function handler(payload: Payload) {
					emit.next(payload);
				}

				eventBus.on("app/heartbeatEvent", handler);

				return function unsubscribe() {
					eventBus.off("app/heartbeatEvent", handler);
				};
			});
		}),
	} as const;
}
