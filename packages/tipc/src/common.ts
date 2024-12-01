import type {
	BrowserWindow,
	IpcMainEvent,
	IpcMainInvokeEvent,
	IpcRendererEvent,
} from "electron";

export const TIPC_GLOBAL_NAMESPACE = "__TIPC_API__";

export function scopedChannel(channel: `${keyof TIPCDefinitions}/${string}`) {
	return `__tipc__/${channel}`;
}

export const defaultSerializer: Serializer = {
	serialize: (val) => val,
	deserialize: (val) => val,
};

export type TIPCDefinitions<
	TInvoke extends Record<string, [unknown, unknown]> = Record<
		string,
		[unknown, unknown]
	>,
	TEventsMain extends Record<string, unknown> = Record<string, unknown>,
	TEventsRenderer extends Record<string, unknown> = Record<string, unknown>,
> = {
	invoke: TInvoke;
	eventsMain: TEventsMain;
	eventsRenderer: TEventsRenderer;
};

export type TIPCMain<TDefinitions extends TIPCDefinitions> = {
	handle: {
		[TChannel in keyof TDefinitions["invoke"]]: (
			handler: (
				event: IpcMainInvokeEvent,
				...args: keyof TDefinitions["invoke"][TChannel][0] extends never
					? []
					: [TDefinitions["invoke"][TChannel][0]]
			) =>
				| TDefinitions["invoke"][TChannel][1]
				| Promise<TDefinitions["invoke"][TChannel][1]>,
		) => void;
	};

	publish: {
		[TChannel in keyof TDefinitions["eventsMain"]]: (
			...args: keyof TDefinitions["eventsMain"][TChannel] extends never
				? [BrowserWindow[]]
				: [BrowserWindow[], TDefinitions["eventsMain"][TChannel]]
		) => void;
	};

	subscribe: {
		[TChannel in keyof TDefinitions["eventsRenderer"]]: (
			handler: (
				event: IpcMainEvent,
				payload: TDefinitions["eventsRenderer"][TChannel],
			) => void | PromiseLike<void>,
		) => () => void;
	};
};

export type TIPCRenderer<TDefinitions extends TIPCDefinitions> = {
	invoke: {
		[TChannel in keyof TDefinitions["invoke"]]: (
			...args: keyof TDefinitions["invoke"][TChannel][0] extends never
				? []
				: [TDefinitions["invoke"][TChannel][0]]
		) => Promise<TDefinitions["invoke"][TChannel][1]>;
	};

	publish: {
		[TChannel in keyof TDefinitions["eventsRenderer"]]: (
			...args: keyof TDefinitions["eventsRenderer"][TChannel] extends never
				? []
				: [TDefinitions["eventsRenderer"][TChannel]]
		) => void;
	};

	subscribe: {
		[TChannel in keyof TDefinitions["eventsMain"]]: (
			handler: (
				event: IpcRendererEvent,
				payload: TDefinitions["eventsMain"][TChannel],
			) => void | PromiseLike<void>,
		) => () => void;
	};
};

export type Serializer = {
	serialize: <T>(val: T) => Serialized<T>;
	deserialize: <T>(val: Serialized<T>) => T;
};

export type Serialized<T> = T;

export type Logger = {
	debug: (...args: unknown[]) => unknown;
	verbose: (...args: unknown[]) => unknown;
	info: (...args: unknown[]) => unknown;
	warn: (...args: unknown[]) => unknown;
	error: (...args: unknown[]) => unknown;
};
