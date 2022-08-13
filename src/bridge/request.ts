import { ipcMain, ipcRenderer } from "electron";

import type { IpcMainInvokeEvent } from "electron";
import type { Requests, RequestChannelName } from "~/common/bridge/types";

export const rendererRequester =
	<K extends RequestChannelName>(channel: K) =>
	async (
		...args: keyof Parameters<Requests[K]>[0] extends never
			? []
			: [Parameters<Requests[K]>[0]]
	) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const response: ReturnType<Requests[K]> = await (args[0]
			? ipcRenderer.invoke(channel, args[0])
			: ipcRenderer.invoke(channel, {}));

		return response;
	};

export const mainResponder = <K extends RequestChannelName>(
	channel: K,
	handler: (
		event: IpcMainInvokeEvent,
		payload: Parameters<Requests[K]> extends []
			? void
			: Parameters<Requests[K]>[0],
	) => Promise<ReturnType<Requests[K]>>,
): (() => void) => {
	ipcMain.handle(
		channel,
		async (
			event: IpcMainInvokeEvent,
			payload: Parameters<Requests[K]> extends []
				? void
				: Parameters<Requests[K]>[0],
		) => handler(event, payload),
	);

	return () => ipcMain.removeHandler(channel);
};
