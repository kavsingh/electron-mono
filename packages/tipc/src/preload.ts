import { contextBridge, ipcRenderer } from "electron";

import { scopeChannel, TIPC_GLOBAL_NAMESPACE } from "./common";

import type { Logger } from "./common";
import type { IpcRendererEvent } from "electron";

function createTIPCApi(options?: { logger?: Logger | undefined }) {
	const logger = options?.logger;

	return {
		invoke: (channel: string, payload: unknown) => {
			const scoped = scopeChannel(`invoke/${channel}`);

			logger?.debug("invoke", { scoped, payload });

			return ipcRenderer.invoke(scoped, payload);
		},

		send: (channel: string, payload: unknown) => {
			const scoped = scopeChannel(`eventsRenderer/${channel}`);

			logger?.debug("send", { scoped, payload });
			ipcRenderer.send(scoped, payload);
		},

		subscribe: (
			channel: string,
			handler: (event: IpcRendererEvent, payload: unknown) => void,
		) => {
			const scoped = scopeChannel(`eventsMain/${channel}`);

			logger?.debug("subscribe", { scoped, handler });
			ipcRenderer.addListener(scoped, handler);

			return function unsubscribe() {
				logger?.debug("unsubscribe", { scoped, handler });
				ipcRenderer.removeListener(scoped, handler);
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
