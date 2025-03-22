import { on } from "node:events";

import type { EventEmitter } from "node:events";

export function onEmitter<TEventMap extends Record<string, unknown[]>>(
	emitter: EventEmitter<TEventMap>,
	eventName: keyof TEventMap,
	options?: Parameters<typeof on>[2],
) {
	// @ts-expect-error these types aren't very ergonomic
	return on(emitter, eventName, options) as NodeJS.AsyncIterator<
		TEventMap[typeof eventName],
		undefined,
		undefined
	>;
}
