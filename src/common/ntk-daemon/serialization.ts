import {
	DaemonClientError,
	DaemonError,
} from "@nativeinstruments/ntk-daemon-node-lib";
// eslint-disable-next-line import/no-named-as-default
import Long from "long";

import type {
	NtkDaemonBridgeResponse,
	SerializedDaemonClientError,
	SerializedDaemonError,
	SerializedDaemonResponse,
} from "./types";

export const serializeNtkDaemonResponse = async <T>(
	promise: Promise<T>,
): Promise<NtkDaemonBridgeResponse<T>> => {
	try {
		const message = await promise;

		return { result: "success", message: serializeDaemonResponse(message) };
	} catch (reason) {
		if (reason instanceof DaemonError) {
			return { result: "error", message: serializeDaemonError(reason) };
		}

		if (reason instanceof DaemonClientError) {
			return {
				result: "error",
				message: serializeDaemonClientError(reason),
			};
		}

		if (reason instanceof Error) {
			return { result: "error", message: await serializeError(reason) };
		}

		return {
			result: "error",
			message: await serializeError(new Error(String(reason))),
		};
	}
};

const serializeDaemonResponse = <T>(
	response: T,
): SerializedDaemonResponse<T> => {
	// @ts-expect-error darkness
	if (Long.isLong(response)) return BigInt(response.toString());

	if (Array.isArray(response)) {
		// @ts-expect-error darkness
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return response.map((part) => serializeDaemonResponse(part));
	}

	if (response && typeof response === "object") {
		// @ts-expect-error darkness
		return Object.fromEntries(
			Object.entries(response).map(([key, val]) => [
				key,
				serializeDaemonResponse(val),
			]),
		);
	}

	// @ts-expect-error darkness
	return response;
};

const serializeDaemonError = (error: DaemonError): SerializedDaemonError => ({
	name: "DaemonError",
	message: error.message,
	type: error.type,
	stack: error.stack,
});

const serializeDaemonClientError = (
	error: DaemonClientError,
): SerializedDaemonClientError => ({
	name: "DaemonClientError",
	message: error.message,
	type: error.type,
	stack: error.stack,
});

const serializeError = async (error: Error) => {
	const lib = await import("serialize-error");

	return lib.serializeError(error);
};
