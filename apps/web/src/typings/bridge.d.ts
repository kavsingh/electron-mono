import type {
	WebBridgeApi,
	BRIDGE_NAME,
} from "@electron-mono/shared/web-bridge-api";

declare global {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface Window {
		[BRIDGE_NAME]: WebBridgeApi;
	}
}
