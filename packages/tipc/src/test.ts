import type { TIPCResult } from "./common";

export function createMockTIPCOkResult<TValue = unknown>(
	value: TValue,
): Extract<TIPCResult<TValue>, { result: "ok" }> {
	return { result: "ok", value };
}

export function createMockTIPCErrorResult(
	error: Error,
): Extract<TIPCResult, { result: "error" }> {
	return { result: "error", error };
}
