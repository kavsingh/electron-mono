import { contextBridge, ipcRenderer } from "electron";

import { scopeChannel, ELECTRON_TIPC_GLOBAL_NAMESPACE } from "./common";

import type { Logger } from "./common";
import type { IpcRendererEvent } from "electron";

function createElectronTipcPreload(options?: { logger?: Logger | undefined }) {
	const logger = options?.logger;

	return {
		invoke: async (channel: string, payload: unknown) => {
			const scopedChannel = scopeChannel(`${channel}/invoke`);

			logger?.debug("invoke", { scopedChannel, payload });

			const result: unknown = await ipcRenderer.invoke(scopedChannel, payload);

			logger?.debug("invoke result", { scopedChannel, result });

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

export function exposeElectronTipc(options?: { logger?: Logger | undefined }) {
	contextBridge.exposeInMainWorld(
		ELECTRON_TIPC_GLOBAL_NAMESPACE,
		createElectronTipcPreload(options),
	);
}

export type ElectronTipcPreload = ReturnType<typeof createElectronTipcPreload>;