import { EventEmitter } from "node:events";

import type { SystemStats } from "./system-stats";
import type TypedEmitter from "typed-emitter";

export function createAppEventBus() {
	return new EventEmitter() as TypedEmitter<AppEventMap>;
}

export type AppEventBus = ReturnType<typeof createAppEventBus>;

export type AppEventName = keyof AppEventMap;

export type AppEvent<K extends AppEventName> = Parameters<AppEventMap[K]>[0];

type AppEventMap = {
	systemStats: (payload: SystemStats) => void | Promise<void>;
};
