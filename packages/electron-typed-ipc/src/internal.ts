import type { Logger } from "./common";

export function exhaustive(param: never, logger?: Logger) {
	// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
	logger?.warn(`unknown value ${param}`);
}

export type TypedIpcResult<TValue = unknown> =
	| { __r: "ok"; data: TValue }
	| { __r: "error"; error: unknown };
