export const BRIDGE_NAME = "__BRIDGE__";

export type WebBridgeApi = {
	getSystemInfo: () => Promise<{ osName: string; osVersion: string }>;
};
