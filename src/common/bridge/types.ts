import type {
	DaemonStatusEvent,
	DaemonVersionResponse,
} from "@nativeinstruments/ntk-daemon-node-lib";

// Note: return types will be wrapped in a promise
export interface Requests {
	getSystemInfo: () => SystemInfo;
	getNtkDaemonVersion: () => DaemonVersionResponse;
}

export type RequestChannelName = keyof Requests;

export interface Messages {
	health: HealthMessage;
	systemInfo: SystemInfo;
	ntkDaemonStatus: DaemonStatusEvent;
}

export type MessageChannelName = keyof Messages;

export type HealthMessage =
	| { status: "ok"; timestamp: bigint }
	| { status: "error"; timestamp: bigint; error: Error };

export interface SystemInfo {
	os: string;
	totalMemory: bigint;
	freeMemory: bigint;
}
