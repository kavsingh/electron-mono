import { ipcMain, ipcRenderer } from "electron";

import type { Requests, RequestChannelName } from "./types";
import type { IpcMainInvokeEvent } from "electron";

export const rendererRequester =
	<K extends RequestChannelName>(channel: K) =>
	async (
		...args: keyof Parameters<Requests[K]>[0] extends never
			? []
			: [Parameters<Requests[K]>[0]]
	) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const response: ReturnType<Requests[K]> = await ipcRenderer.invoke(
			channel,
			args[0],
		);

		return response;
	};

export const mainResponder = <K extends RequestChannelName>(
	channel: K,
	handler: (
		event: IpcMainInvokeEvent,
		payload: Parameters<Requests[K]> extends []
			? never
			: Parameters<Requests[K]>[0],
	) => Promise<ReturnType<Requests[K]>>,
): (() => void) => {
	ipcMain.handle(
		channel,
		async (
			event: IpcMainInvokeEvent,
			payload: Parameters<Requests[K]> extends []
				? never
				: Parameters<Requests[K]>[0],
		) => {
			assertValidSender(event);

			return handler(event, payload);
		},
	);

	return () => ipcMain.removeHandler(channel);
};

const assertValidSender = (event: IpcMainInvokeEvent) => {
	const host = new URL(event.senderFrame.url).host;
	const isValidHost = import.meta.env.DEV
		? host.startsWith("localhost")
		: host === "";

	if (!isValidHost) throw new Error("Invalid sender");
};
