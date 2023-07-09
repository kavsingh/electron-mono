import { EventEmitter } from "eventemitter3";

import type { SystemInfo } from "./system-info";

export function createAppEventBus() {
	return new EventEmitter<AppEventMap, never>();
}

export type AppEventBus = ReturnType<typeof createAppEventBus>;

export type AppEventName = keyof AppEventMap;

export type AppEvent<K extends AppEventName> = AppEventMap[K][0];

type AppEventMap = {
	heartbeat: [{ timestamp: number }];
	systemInfo: [SystemInfo];
};
