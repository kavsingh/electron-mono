import type {
	ElectronTypedIpcMutation,
	ElectronTypedIpcQuery,
	ElectronTypedIpcSendFromMain,
	ElectronTypedIpcSendFromRenderer,
	ElectronTypedIpcLogger,
	ElectronTypedIpcOperation,
} from "./common";

export function scopeChannel(
	channel: `${string}/${ElectronTypedIpcOperation["operation"]}`,
) {
	return `__tipc__/${channel}` as const;
}

export function exhaustive(param: never, logger?: ElectronTypedIpcLogger) {
	// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
	logger?.warn(`unknown value ${param}`);
}

export type IpcPreloadResult<TValue = unknown> =
	| { __r: "ok"; data: TValue }
	| { __r: "error"; error: unknown };

export type AnySchema = {
	query: ElectronTypedIpcQuery;
	mutation: ElectronTypedIpcMutation;
	sendMain: ElectronTypedIpcSendFromMain;
	sendRenderer: ElectronTypedIpcSendFromRenderer;
};

export type KeysOfUnion<T> = T extends T ? keyof T : never;
