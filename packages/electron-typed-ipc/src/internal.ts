export type TIPCResult<TValue = unknown> =
	| { __r: "ok"; data: TValue }
	| { __r: "error"; error: unknown };
