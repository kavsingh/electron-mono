import { contextBridge, ipcRenderer } from "electron";

import { scopeChannel, TIPC_GLOBAL_NAMESPACE } from "./common";

import type { Logger } from "./common";
import type { IpcRendererEvent } from "electron";

function createTIPCApi(options?: { logger?: Logger | undefined }) {
	const logger = options?.logger;

	return {
		invoke: (channel: string, payload: unknown) => {
			const scopedChannel = scopeChannel(`${channel}/invoke`);

			logger?.debug("invoke", { scopedChannel, payload });

			return ipcRenderer.invoke(scopedChannel, payload);
		},

		send: (channel: string, payload: unknown) => {
			const scopedChannel = scopeChannel(`${channel}/sendRenderer`);

			logger?.debug("send", { scopedChannel, payload });
			ipcRenderer.send(scopedChannel, payload);
		},

		sendToHost: (channel: string, payload: unknown) => {
			const scopedChannel = scopeChannel(`${channel}/sendRenderer`);

			logger?.debug("sendToHost", { scopedChannel, payload });
			ipcRenderer.sendToHost(scopedChannel, payload);
		},

		subscribe: (
			channel: string,
			handler: (event: IpcRendererEvent, payload: unknown) => void,
		) => {
			const scopedChannel = scopeChannel(`${channel}/sendMain`);

			logger?.debug("subscribe", { scopedChannel, handler });
			ipcRenderer.addListener(scopedChannel, handler);

			return function unsubscribe() {
				logger?.debug("unsubscribe", { scopedChannel, handler });
				ipcRenderer.removeListener(scopedChannel, handler);
			};
		},
	} as const;
}

export function exposeTIPC(options?: { logger?: Logger | undefined }) {
	contextBridge.exposeInMainWorld(
		TIPC_GLOBAL_NAMESPACE,
		createTIPCApi(options),
	);
}

export type TIPCApi = ReturnType<typeof createTIPCApi>;

declare global {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface Window {
		[TIPC_GLOBAL_NAMESPACE]: TIPCApi;
	}
}
