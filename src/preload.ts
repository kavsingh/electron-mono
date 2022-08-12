import { contextBridge } from "electron";

import { rendererSubscriber } from "./bridge/pubsub";
import { rendererRequester } from "./bridge/request";

const bridge = {
	getSystemInfo: rendererRequester("getSystemInfo"),
	subscribeHealth: rendererSubscriber("health"),
	subscribeSystemInfo: rendererSubscriber("systemInfo"),
};

contextBridge.exposeInMainWorld("bridge", bridge);

declare global {
	interface Window {
		bridge: Immutable<typeof bridge>;
	}
}
