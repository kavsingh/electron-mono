import { contextBridge, ipcRenderer } from "electron";

import { scopeChannel, TIPC_GLOBAL_NAMESPACE } from "./common";

import type { Logger } from "./common";
import type { IpcRendererEvent } from "electron";

function createTIPCApi(options?: { logger?: Logger | undefined }) {
	const logger = options?.logger;

	return {
		invokeQuery: async (channel: string, payload: unknown) => {
			const scopedChannel = scopeChannel(`${channel}/invokeQuery`);

			logger?.debug("invoke query", { scopedChannel, payload });

			const result: unknown = await ipcRenderer.invoke(scopedChannel, payload);

			logger?.debug("invoke query result", { scopedChannel, result });

			return result;
		},

		invokeMutation: async (channel: string, payload: unknown) => {
			const scopedChannel = scopeChannel(`${channel}/invokeMutation`);

			logger?.debug("invoke mutation", { scopedChannel, payload });

			const result: unknown = await ipcRenderer.invoke(scopedChannel, payload);

			logger?.debug("invoke mutation result", { scopedChannel, result });

			return result;
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
