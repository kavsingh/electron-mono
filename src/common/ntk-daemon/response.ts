import {
	DaemonClientError,
	DaemonError,
} from "@nativeinstruments/ntk-daemon-node-lib";
import { deserializeError } from "serialize-error";

import type {
	ExtractErrorMessage,
	ExtractSuccessMessage,
	NtkDaemonBridgeResponse,
	SerializedDaemonClientError,
	SerializedDaemonError,
} from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const matchNtkDaemonResult = <T extends NtkDaemonBridgeResponse<any>>(
	response: T,
	matchers: {
		error: (message: ExtractErrorMessage<T>) => void;
		success?: (message: ExtractSuccessMessage<T>) => void;
	},
) => {
	if (response.result === "error") matchers.error(response.message);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	if (response.result === "success") matchers.success?.(response.message);
};

export const normalizeNtkDaemonResponse = async <T>(
	promise: Promise<NtkDaemonBridgeResponse<T>>,
): Promise<ExtractSuccessMessage<NtkDaemonBridgeResponse<T>>> => {
	const response = await promise;

	if (response.result === "success") return response.message;

	const { message } = response;

	if (message.name === "DaemonError" && "type" in message) {
		throw new DaemonError(message as SerializedDaemonError);
	}

	if (message.name === "DaemonClientError") {
		const error = message as SerializedDaemonClientError;
		const clientError = new DaemonClientError(error.message);

		if (message.stack) clientError.stack = message.stack;

		throw clientError;
	}

	throw deserializeError(message);
};
