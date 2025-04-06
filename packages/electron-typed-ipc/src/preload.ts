import { contextBridge, ipcRenderer } from "electron";

import {
	ELECTRON_TYPED_IPC_GLOBAL_NAMESPACE,
	scopeChannel,
} from "./internal.ts";

import type { Logger } from "./logger.ts";
import type { IpcRendererEvent } from "electron";

function createTypedIpcPreload(options?: { logger?: Logger | undefined }) {
	const logger = options?.logger;

	return {
		query: async (channel: string, payload: unknown) => {
			const scopedChannel = scopeChannel(`${channel}/query`);

			logger?.debug("query", { scopedChannel, payload });

			const result: unknown = await ipcRenderer.invoke(scopedChannel, payload);

			logger?.debug("query result", { scopedChannel, result });

			return result;
		},

		mutate: async (channel: string, payload: unknown) => {
			const scopedChannel = scopeChannel(`${channel}/mutation`);

			logger?.debug("mutation", { scopedChannel, payload });

			const result: unknown = await ipcRenderer.invoke(scopedChannel, payload);

			logger?.debug("mutation result", { scopedChannel, result });

			return result;
		},

		send: (channel: string, payload: unknown) => {
			const scopedChannel = scopeChannel(`${channel}/sendFromRenderer`);

			logger?.debug("send", { scopedChannel, payload });
			ipcRenderer.send(scopedChannel, payload);
		},

		sendToHost: (channel: string, payload: unknown) => {
			const scopedChannel = scopeChannel(`${channel}/sendFromRenderer`);

			logger?.debug("sendToHost", { scopedChannel, payload });
			ipcRenderer.sendToHost(scopedChannel, payload);
		},

		subscribe: (
			channel: string,
			handler: (event: IpcRendererEvent, payload: unknown) => void,
		) => {
			const scopedChannel = scopeChannel(`${channel}/sendFromMain`);

			logger?.debug("subscribe", { scopedChannel, handler });
			ipcRenderer.addListener(scopedChannel, handler);

			return function unsubscribe() {
				logger?.debug("unsubscribe", { scopedChannel, handler });
				ipcRenderer.removeListener(scopedChannel, handler);
			};
		},
	} as const;
}

export function exposeTypedIpc(options?: { logger?: Logger | undefined }) {
	contextBridge.exposeInMainWorld(
		ELECTRON_TYPED_IPC_GLOBAL_NAMESPACE,
		createTypedIpcPreload(options),
	);
}

export type IpcPreloadApi = ReturnType<typeof createTypedIpcPreload>;
