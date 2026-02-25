import { EventEmitter } from "node:events";

import { SystemStats } from "#common/schema/system.ts";

type AppEventMap = Readonly<{
	systemStats: [SystemStats];
}>;

export function createAppEventBus() {
	return new EventEmitter<AppEventMap>();
}

export type AppEventBus = ReturnType<typeof createAppEventBus>;

export type AppEventName = keyof AppEventMap;

export type AppEvent<K extends AppEventName> = AppEventMap[K][0];
