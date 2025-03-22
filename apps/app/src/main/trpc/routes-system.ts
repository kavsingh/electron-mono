import { onEmitter } from "#main/lib/node-events";
import { getSystemInfo } from "#main/services/system-info";
import { getSystemStats } from "#main/services/system-stats";

import { publicProcedure } from "./trpc-server";

import type { AppEventBus } from "#main/services/app-event-bus";

export default function routesSystem(eventBus: AppEventBus) {
	return {
		systemInfo: publicProcedure.query(() => getSystemInfo()),

		systemStats: publicProcedure.query(() => getSystemStats()),

		systemStatsEvent: publicProcedure.subscription(async function* (opts) {
			for await (const [event] of onEmitter(eventBus, "systemStats", {
				signal: opts.signal,
			})) {
				yield event;
			}
		}),
	} as const;
}
