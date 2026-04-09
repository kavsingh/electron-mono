import { getSystemInfo } from "~/main/services/system-info.ts";
import { getSystemStats } from "~/main/services/system-stats.ts";

import { t } from "./trpc-server.ts";

import type { AppEventBus } from "~/main/services/app-event-bus.ts";

export function routesSystem(eventBus: AppEventBus) {
	return {
		systemInfo: t.procedure.query(() => getSystemInfo()),

		systemStats: t.procedure.query(() => getSystemStats()),

		systemStatsEvent: t.procedure.subscription(async function* (opts) {
			for await (const [event] of eventBus.toIterable("systemStats", {
				signal: opts.signal,
			})) {
				yield event;
			}
		}),
	} as const;
}
