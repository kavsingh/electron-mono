import { observable } from "@trpc/server/observable";

import { onEmitter as _ } from "~/main/lib/node-events.ts";
import { getSystemInfo } from "~/main/services/system-info.ts";
import { getSystemStats } from "~/main/services/system-stats.ts";

import { publicProcedure } from "./trpc-server.ts";

import type { AppEvent, AppEventBus } from "~/main/services/app-event-bus.ts";

// note: required legacy type not exported by trpc for project refs to work
// without complaints
export function routesSystem(eventBus: AppEventBus) {
	return {
		systemInfo: publicProcedure.query(() => getSystemInfo()),

		systemStats: publicProcedure.query(() => getSystemStats()),

		// this does not seem to work with trpc-electron, use legacy below for now
		// @TODO: why?
		// systemStatsEvent: publicProcedure.subscription(async function* (opts) {
		// 	for await (const [event] of onEmitter(eventBus, "systemStats", {
		// 		signal: opts.signal,
		// 	})) {
		// 		yield event;
		// 	}
		// }),

		// see above
		// oxlint-disable-next-line typescript/no-deprecated
		systemStatsEvent: publicProcedure.subscription(() => {
			return observable<AppEvent<"systemStats">>((emit) => {
				eventBus.on("systemStats", emit.next);
			});
		}),
	} as const;
}
