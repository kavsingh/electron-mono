import { contextBridge, ipcRenderer } from "electron";

import { ELECTRON_TYPED_IPC_GLOBAL_NAMESPACE } from "./common";
import { scopeChannel } from "./internal";

import type { ElectronTypedIpcLogger } from "./common";
import type { IpcRendererEvent } from "electron";

function createTypedIpcPreload(options?: {
	logger?: ElectronTypedIpcLogger | undefined;
}) {
	const logger = options?.logger;

	return {
		invokeQuery: async (channel: string, payload: unknown) => {
			const scopedChannel = scopeChannel(`${channel}/query`);

			logger?.debug("invoke query", { scopedChannel, payload });

			const result: unknown = await ipcRenderer.invoke(scopedChannel, payload);

			logger?.debug("invoke query result", { scopedChannel, result });

			return result;
		},

		invokeMutation: async (channel: string, payload: unknown) => {
			const scopedChannel = scopeChannel(`${channel}/mutation`);

			logger?.debug("invoke mutation", { scopedChannel, payload });

			const result: unknown = await ipcRenderer.invoke(scopedChannel, payload);

			logger?.debug("invoke mutation result", { scopedChannel, result });

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

export function exposeTypedIpc(options?: {
	logger?: ElectronTypedIpcLogger | undefined;
}) {
	contextBridge.exposeInMainWorld(
		ELECTRON_TYPED_IPC_GLOBAL_NAMESPACE,
		createTypedIpcPreload(options),
	);
}

export type TypedIpcPreload = ReturnType<typeof createTypedIpcPreload>;
