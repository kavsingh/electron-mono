import { ipcRenderer } from "electron";

import type { Messages, MessageChannelName } from "./types";
import type { IpcRendererEvent, BrowserWindow } from "electron";

export const mainPublish = <K extends MessageChannelName>(
	win: BrowserWindow,
	channel: K,
	payload: Messages[K],
): void => {
	if (win.isDestroyed()) return;

	win.webContents.send(channel, payload);
};

export const rendererSubscriber =
	<K extends MessageChannelName>(channel: K) =>
	(handler: RendererMessageHandler<K>): (() => void) => {
		const ipcHandler: RendererIpcEventHandler<K> = (_, message) =>
			handler(message);

		ipcRenderer.on(channel, ipcHandler);

		return () => ipcRenderer.removeListener(channel, ipcHandler);
	};

type RendererMessageHandler<K extends MessageChannelName> = (
	message: Messages[K],
) => void;

type RendererIpcEventHandler<K extends MessageChannelName> = (
	event: IpcRendererEvent,
	message: Messages[K],
) => void;
