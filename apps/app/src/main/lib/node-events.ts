import { on } from "node:events";

import type { EventEmitter } from "node:events";

export function onEmitter<
	TEventMap extends Record<string, unknown[]>,
	TEventName extends keyof TEventMap,
>(
	emitter: EventEmitter<TEventMap>,
	eventName: TEventName,
	options?: Parameters<typeof on>[2],
) {
	// @ts-expect-error these types aren't very ergonomic
	// oxlint-disable typescript/no-unsafe-type-assertion
	return on(emitter, eventName, options) as NodeJS.AsyncIterator<
		TEventMap[TEventName],
		undefined,
		undefined
	>;
}
