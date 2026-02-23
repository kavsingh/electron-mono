import { routesFiles } from "./routes-files";
import { routesSystem } from "./routes-system";
import { routesTheme } from "./routes-theme";
import { router } from "./trpc-server";

import type { AppEventBus } from "#main/services/app-event-bus";

export function createAppRouter(eventBus: AppEventBus) {
	return router({
		...routesTheme(),
		...routesSystem(eventBus),
		...routesFiles(),
	} as const);
}

export type AppRouter = ReturnType<typeof createAppRouter>;
