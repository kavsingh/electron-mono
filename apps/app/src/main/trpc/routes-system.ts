import { observable } from "@trpc/server/observable";

import { getSystemInfo } from "#main/services/system-info";
import { getSystemStats } from "#main/services/system-stats";

import { publicProcedure } from "./trpc-server";

import type { AppEvent, AppEventBus } from "#main/services/app-event-bus";

export default function routesSystem(eventBus: AppEventBus) {
	return {
		systemInfo: publicProcedure.query(() => getSystemInfo()),

		systemStats: publicProcedure.query(() => getSystemStats()),

		systemStatsEvent: publicProcedure.subscription(() => {
			type Payload = AppEvent<"systemStats">;

			return observable<Payload>((emit) => {
				function handler(payload: Payload) {
					emit.next(payload);
				}

				eventBus.on("systemStats", handler);

				return function unsubscribe() {
					eventBus.off("systemStats", handler);
				};
			});
		}),
	} as const;
}
