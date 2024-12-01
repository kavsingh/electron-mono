import { contextBridge, ipcRenderer } from "electron";

import { scopedChannel, TIPC_GLOBAL_NAMESPACE } from "./common";

import type { IpcRendererEvent } from "electron";

const tipcApi = {
	invoke: (channel: string, payload: unknown) => {
		return ipcRenderer.invoke(
			scopedChannel(`invoke/${channel}`),
			payload,
		) as Promise<unknown>;
	},

	send: (channel: string, payload: unknown) => {
		ipcRenderer.send(scopedChannel(`eventsRenderer/${channel}`), payload);
	},

	subscribe: (
		channel: string,
		handler: (event: IpcRendererEvent, payload: unknown) => void,
	) => {
		const scoped = scopedChannel(`eventsMain/${channel}`);

		ipcRenderer.addListener(scoped, handler);

		return function unsubscribe() {
			ipcRenderer.removeListener(scoped, handler);
		};
	},
} as const;

export function exposeTIPC() {
	contextBridge.exposeInMainWorld(TIPC_GLOBAL_NAMESPACE, tipcApi);
}

export type TIPCApi = typeof tipcApi;

declare global {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface Window {
		[TIPC_GLOBAL_NAMESPACE]: TIPCApi;
	}
}
