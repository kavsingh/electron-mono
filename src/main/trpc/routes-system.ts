import { observable } from "@trpc/server/observable";

import { getSystemInfo } from "~/main/services/system-info";

import { publicProcedure } from "./trpc-server";

import type { AppEvent, AppEventBus } from "~/main/services/app-event-bus";

export default function routesSystem(eventBus: AppEventBus) {
	return {
		systemInfo: publicProcedure.query(() => getSystemInfo()),

		systemInfoEvent: publicProcedure.subscription(() => {
			type Payload = AppEvent<"systemInfo">;

			return observable<Payload>((emit) => {
				function handler(payload: Payload) {
					emit.next(payload);
				}

				eventBus.on("systemInfo", handler);

				return function unsubscribe() {
					eventBus.off("systemInfo", handler);
				};
			});
		}),
	} as const;
}
