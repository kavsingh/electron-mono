import type { DaemonErrorType } from "@nativeinstruments/ntk-daemon-node-lib";
import type { ErrorObject } from "serialize-error";

export type NtkDaemonBridgeResponse<T> =
	| NtkDaemonBridgeSuccessResponse<T>
	| NtkDaemonBridgeErrorResponse;

export type NtkDaemonBridgeSuccessResponse<T> = {
	result: "success";
	message: SerializedDaemonResponse<T>;
};

export type NtkDaemonBridgeErrorResponse = {
	result: "error";
	message: SerializedDaemonError | SerializedDaemonClientError | ErrorObject;
};

export type SerializedDaemonResponse<T> = T extends Long
	? bigint
	: T extends Array<infer U>
	? SerializedDaemonResponse<U>
	: // eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends Record<any, any>
	? { [K in keyof T]: SerializedDaemonResponse<T[K]> }
	: T;

export type SerializedDaemonError = {
	name: "DaemonError";
	message: string;
	type: DaemonErrorType;
	stack?: string | undefined;
};

export type SerializedDaemonClientError = {
	name: "DaemonClientError";
	message: string;
	stack?: string | undefined;
	type?: unknown | undefined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtractSuccessMessage<T extends NtkDaemonBridgeResponse<any>> =
	Extract<T, { result: "success" }>["message"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtractErrorMessage<T extends NtkDaemonBridgeResponse<any>> =
	Extract<T, { result: "error" }>["message"];
