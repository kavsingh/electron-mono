export const ELECTRON_TYPED_IPC_GLOBAL_NAMESPACE = "__ELECTRON_TYPED_IPC__";

import type { Logger } from "./logger";

export function scopeChannel(channel: `${string}/${Operation["operation"]}`) {
	return `__tipc__/${channel}` as const;
}

export function exhaustive(param: never, logger?: Logger) {
	// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
	logger?.warn(`unknown value ${param}`);
}

export type Definition = Readonly<Record<string, Operation>>;

export type Schema<TDefinition extends Definition> = Readonly<{
	[K in keyof TDefinition]: OperationWithChannel<TDefinition[K]>;
}>;

export type Operation = Query | Mutation | SendFromMain | SendFromRenderer;

export type Query<TResponse = unknown, TInput = unknown> = {
	operation: "query";
	input: TInput;
	response: TResponse;
};

export type Mutation<TResponse = unknown, TInput = unknown> = {
	operation: "mutation";
	input: TInput;
	response: TResponse;
};

export type SendFromMain<TPayload = unknown> = {
	operation: "sendFromMain";
	payload: TPayload;
};

export type SendFromRenderer<TPayload = unknown> = {
	operation: "sendFromRenderer";
	payload: TPayload;
};

export type OperationWithChannel<TOperation extends Operation> = TOperation & {
	channel: string;
};

export type RemoveHandlerFn = () => void;

export type UnsubscribeFn = () => void;

export type IpcResult<TValue = unknown> =
	| { __r: "ok"; data: TValue }
	| { __r: "error"; error: unknown };

export type AnyDefinition = {
	query: Query;
	mutation: Mutation;
	sendMain: SendFromMain;
	sendRenderer: SendFromRenderer;
};

export type AnySchema = Schema<AnyDefinition>;

export type KeysOfUnion<T> = T extends T ? keyof T : never;
