import type {
	Mutation,
	Query,
	SendFromMain,
	SendFromRenderer,
	Logger,
	Operation,
} from "./common";

export function scopeChannel(channel: `${string}/${Operation["operation"]}`) {
	return `__tipc__/${channel}` as const;
}

export function exhaustive(param: never, logger?: Logger) {
	// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
	logger?.warn(`unknown value ${param}`);
}

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
