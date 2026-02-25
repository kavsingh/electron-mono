import { routesFiles } from "./routes-files.ts";
import { routesSystem } from "./routes-system.ts";
import { routesTheme } from "./routes-theme.ts";
import { router } from "./trpc-server.ts";

import type { AppEventBus } from "#main/services/app-event-bus.ts";

export function createAppRouter(eventBus: AppEventBus) {
	return router({
		...routesTheme(),
		...routesSystem(eventBus),
		...routesFiles(),
	} as const);
}

export type AppRouter = ReturnType<typeof createAppRouter>;
