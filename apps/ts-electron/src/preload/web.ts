import { BRIDGE_NAME } from "@ts-electron/shared/web-bridge-api";
import { contextBridge } from "electron";

import type { WebBridgeApi } from "@ts-electron/shared/web-bridge-api";

const bridge: WebBridgeApi = {
	getSystemInfo() {
		return Promise.resolve({
			osName: process.platform,
			osVersion: process.getSystemVersion(),
		});
	},
	getUserFiles() {
		return Promise.resolve(["file1", "file2"]);
	},
};

contextBridge.exposeInMainWorld(BRIDGE_NAME, bridge);
