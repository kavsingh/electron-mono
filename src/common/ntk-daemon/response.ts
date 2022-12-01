import {
	DaemonClientError,
	DaemonError,
} from "@nativeinstruments/ntk-daemon-node-lib";

import type {
	ExtractErrorMessage,
	ExtractSuccessMessage,
	NtkDaemonBridgeResponse,
	SerializedDaemonClientError,
	SerializedDaemonError,
} from "./types";

export const normalizeNtkDaemonResponse = async <T>(
	promise: Promise<NtkDaemonBridgeResponse<T>>,
): Promise<ExtractSuccessMessage<NtkDaemonBridgeResponse<T>>> => {
	const response = await promise;

	if (response.result === "success") return response.message;

	const { message } = response;

	if (isSerializedDaemonError(message)) throw new DaemonError(message);

	if (isSerializedDaemonClientError(message)) {
		throw new DaemonClientError(message);
	}

	throw await deserializeError(message);
};

const isSerializedDaemonError = (
	message: ExtractErrorMessage<NtkDaemonBridgeResponse<unknown>>,
): message is SerializedDaemonError =>
	message.name === "DaemonError" && "type" in message;

const isSerializedDaemonClientError = (
	message: ExtractErrorMessage<NtkDaemonBridgeResponse<unknown>>,
): message is SerializedDaemonClientError =>
	message.name === "DaemonClientError";

const deserializeError = async (error: unknown) => {
	const lib = await import("serialize-error");

	return lib.serializeError(error);
};
