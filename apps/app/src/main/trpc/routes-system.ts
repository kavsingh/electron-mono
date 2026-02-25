import { onEmitter } from "#main/lib/node-events.ts";
import { getSystemInfo } from "#main/services/system-info.ts";
import { getSystemStats } from "#main/services/system-stats.ts";

import { publicProcedure } from "./trpc-server.ts";

import type { AppEventBus } from "#main/services/app-event-bus.ts";

export function routesSystem(eventBus: AppEventBus) {
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
