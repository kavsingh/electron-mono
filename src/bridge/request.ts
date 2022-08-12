import { ipcMain, ipcRenderer } from "electron";

import {
	serializeBridgePayload,
	deserializeBridgePayload,
} from "~/common/bridge/serialization";

import type { IpcMainInvokeEvent } from "electron";
import type {
	SerializedBridgePayload,
	DeserializedBridgePayload,
} from "~/common/bridge/serialization";
import type { Requests, RequestChannelName } from "~/common/bridge/types";

export const rendererRequester =
	<K extends RequestChannelName>(channel: K) =>
	async (
		...args: keyof Parameters<Requests[K]>[0] extends never
			? []
			: [Parameters<Requests[K]>[0]]
	) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const response: SerializedBridgePayload<ReturnType<Requests[K]>> =
			await (args[0]
				? ipcRenderer.invoke(channel, serializeBridgePayload(args[0]))
				: ipcRenderer.invoke(channel, {}));

		return deserializeBridgePayload(response);
	};

export const mainResponder = <K extends RequestChannelName>(
	channel: K,
	handler: (
		event: IpcMainInvokeEvent,
		payload: DeserializedBridgePayload<
			Parameters<Requests[K]> extends [] ? void : Parameters<Requests[K]>[0]
		>,
	) => Promise<ReturnType<Requests[K]>>,
): (() => void) => {
	ipcMain.handle(
		channel,
		(
			event: IpcMainInvokeEvent,
			payload: SerializedBridgePayload<
				Parameters<Requests[K]> extends [] ? void : Parameters<Requests[K]>[0]
			>,
		) =>
			handler(event, deserializeBridgePayload(payload))
				.then(serializeBridgePayload)
				.catch((reason) => {
					throw serializeBridgePayload(reason);
				}),
	);

	return () => ipcMain.removeHandler(channel);
};
