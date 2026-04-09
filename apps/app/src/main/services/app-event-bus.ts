import { SystemStats } from "~/common/schema/system.ts";
import { IterableEventEmitter } from "~/main/lib/node-events.ts";

type AppEventMap = Readonly<{ systemStats: [SystemStats] }>;

type AppEventName = keyof AppEventMap;

type AppEvent<K extends AppEventName> = AppEventMap[K][0];

function createAppEventBus() {
	return new IterableEventEmitter<AppEventMap>();
}

type AppEventBus = ReturnType<typeof createAppEventBus>;

export { createAppEventBus };
export type { AppEventBus, AppEvent, AppEventName };
