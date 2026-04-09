import { EventEmitter, on } from "node:events";

type EventMap = Record<string, unknown[]>;
type Options = NonNullable<Parameters<typeof on>[2]>;

function toIterable<
	TEventMap extends EventMap,
	TEventName extends keyof TEventMap,
>(emitter: EventEmitter<TEventMap>, eventName: TEventName, options?: Options) {
	// @ts-expect-error provided types aren't very ergonomic
	// oxlint-disable typescript/no-unsafe-type-assertion
	return on(emitter, eventName, options) as NodeJS.AsyncIterator<
		TEventMap[TEventName],
		undefined,
		unknown
	>;
}

class IterableEventEmitter<
	TEventMap extends EventMap,
> extends EventEmitter<TEventMap> {
	toIterable<TName extends keyof TEventMap>(eventName: TName, opts?: Options) {
		return toIterable(this, eventName, opts);
	}
}

export { IterableEventEmitter, toIterable };
