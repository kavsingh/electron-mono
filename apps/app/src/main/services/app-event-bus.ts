import { EventEmitter } from "node:events";

import type { SystemStats } from "./system-stats";

type AppEventMap = Readonly<{
	systemStats: [SystemStats];
}>;

export function createAppEventBus() {
	return new EventEmitter<AppEventMap>();
}

export type AppEventBus = ReturnType<typeof createAppEventBus>;

export type AppEventName = keyof AppEventMap;

export type AppEvent<K extends AppEventName> = AppEventMap[K][0];
