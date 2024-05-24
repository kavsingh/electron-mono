import { BRIDGE_NAME } from "@electron-mono/shared/web-bridge-api";
import { contextBridge } from "electron";

import type { WebBridgeApi } from "@electron-mono/shared/web-bridge-api";

const bridge: WebBridgeApi = {
	getSystemInfo() {
		return Promise.resolve({
			osName: process.platform,
			osVersion: process.getSystemVersion(),
		});
	},
};

contextBridge.exposeInMainWorld(BRIDGE_NAME, bridge);
