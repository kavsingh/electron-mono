export const ELECTRON_TYPED_IPC_GLOBAL_NAMESPACE = "__ELECTRON_TYPED_IPC__";

import type { Logger } from "./logger";
import type {
	Mutation,
	Query,
	SendFromMain,
	SendFromRenderer,
	Operation,
} from "./schema";

export function scopeChannel(channel: `${string}/${Operation["operation"]}`) {
	return `__tipc__/${channel}` as const;
}

export function exhaustive(param: never, logger?: Logger) {
	// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
	logger?.warn(`unknown value ${param}`);
}

export type RemoveHandlerFn = () => void;

export type UnsubscribeFn = () => void;

export type IpcPreloadResult<TValue = unknown> =
	| { __r: "ok"; data: TValue }
	| { __r: "error"; error: unknown };

export type AnySchema = {
	query: Query;
	mutation: Mutation;
	sendMain: SendFromMain;
	sendRenderer: SendFromRenderer;
};

export type KeysOfUnion<T> = T extends T ? keyof T : never;
