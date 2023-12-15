import { contextBridge, ipcRenderer } from "electron";

const gqlIpc: BridgeApi["gqlIpc"] = {
	send(...args: Parameters<(typeof ipcRenderer)["send"]>) {
		ipcRenderer.send(...args);
	},
	on(...args: Parameters<(typeof ipcRenderer)["on"]>) {
		return ipcRenderer.on(...args);
	},
	removeListener(...args: Parameters<(typeof ipcRenderer)["removeListener"]>) {
		return ipcRenderer.removeListener(...args);
	},
};

process.once("loaded", () => {
	contextBridge.exposeInMainWorld("bridgeApi", { gqlIpc });
});

export type BridgeApi = {
	/** subset of ipcRenderer needed for graphql link */
	readonly gqlIpc: Readonly<
		Pick<typeof ipcRenderer, "send" | "on" | "removeListener">
	>;
};

declare global {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface Window {
		bridgeApi: BridgeApi;
	}
}
