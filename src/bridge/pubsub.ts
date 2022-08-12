import { ipcRenderer } from "electron";

import {
	deserializeBridgePayload,
	serializeBridgePayload,
} from "~/common/bridge/serialization";

import type { IpcRendererEvent, BrowserWindow } from "electron";
import type {
	DeserializedBridgePayload,
	SerializedBridgePayload,
} from "~/common/bridge/serialization";
import type { Messages, MessageChannelName } from "~/common/bridge/types";

export const mainPublish = <K extends MessageChannelName>(
	win: BrowserWindow,
	channel: K,
	payload: Messages[K],
): void => {
	if (win.isDestroyed()) return;

	win.webContents.send(channel, serializeBridgePayload(payload));
};

export const rendererSubscriber =
	<K extends MessageChannelName>(channel: K) =>
	(handler: RendererMessageHandler<K>): (() => void) => {
		const ipcHandler: RendererEventHandler<K> = (_, message) =>
			handler(deserializeBridgePayload(message));

		ipcRenderer.on(channel, ipcHandler);

		return () => ipcRenderer.removeListener(channel, ipcHandler);
	};

type RendererMessageHandler<K extends MessageChannelName> = (
	message: DeserializedBridgePayload<Messages[K]>,
) => void;

type RendererEventHandler<K extends MessageChannelName> = (
	event: IpcRendererEvent,
	message: SerializedBridgePayload<Messages[K]>,
) => void;
