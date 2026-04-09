import { observable } from "@trpc/server/observable";

import { getSystemInfo } from "~/main/services/system-info.ts";
import { getSystemStats } from "~/main/services/system-stats.ts";

import { t } from "./trpc-server.ts";

import type { AppEvent, AppEventBus } from "~/main/services/app-event-bus.ts";

// required trpc legacy type is not exposed, causing complaints when using
// typescript project refs. does not affect linting or runtime, ignore for now
export function routesSystem(eventBus: AppEventBus) {
	return {
		systemInfo: t.procedure.query(() => getSystemInfo()),

		systemStats: t.procedure.query(() => getSystemStats()),

		// async gen doesn't seem to work with trpc-electron, use legacy for now
		// @TODO: why?
		// systemStatsEvent: t.procedure.subscription(async function* (opts) {
		// 	for await (const [event] of eventBus.toIterable("systemStats", {
		// 		signal: opts.signal,
		// 	})) {
		// 		yield event;
		// 	}
		// }),

		// see above
		// oxlint-disable-next-line typescript/no-deprecated
		systemStatsEvent: t.procedure.subscription(() => {
			return observable<AppEvent<"systemStats">>((emit) => {
				eventBus.on("systemStats", emit.next);
			});
		}),
	} as const;
}
