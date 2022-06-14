import { contextBridge } from "electron";

import { rendererSubscriber } from "~/bridge/pubsub";
import { rendererRequester } from "~/bridge/request";

const bridge = {
	getSystemInfo: rendererRequester("getSystemInfo"),
	getNtkDaemonVersion: rendererRequester("getNtkDaemonVersion"),
	subscribeSystemInfo: rendererSubscriber("systemInfo"),
	subscribeNtkDaemonStatus: rendererSubscriber("ntkDaemonStatus"),
};

contextBridge.exposeInMainWorld("bridge", bridge);

declare global {
	interface Window {
		bridge: Immutable<typeof bridge>;
	}
}
