import type {
	BrowserWindow,
	IpcMain,
	IpcRenderer,
	WebContents,
} from "electron";

export const ELECTRON_TIPC_GLOBAL_NAMESPACE = "__ELECTRON_TIPC__";

export function scopeChannel(channel: `${string}/${string}`) {
	return `__electron_tipc__/${channel}` as const;
}

export const defaultSerializer: Serializer = {
	serialize: (val) => val,
	deserialize: (val) => val,
};

export function createValueSerializer<TValue, TSerialized = unknown>(
	serializer: ValueSerializer<TValue, TSerialized>,
) {
	return serializer;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createSerializer<T extends ValueSerializer<any, any>>(
	serializers: T[],
): Serializer {
	if (!serializers.length) return defaultSerializer;

	function serialize(value: unknown): unknown {
		for (const serializer of serializers) {
			if (serializer.isDeserialized(value)) {
				return serializer.serialize(value);
			}
		}

		if (!value) return value;

		if (Array.isArray(value)) {
			return value.map((val: unknown) => serialize(val));
		}

		if (value instanceof Error) return Error;

		if (typeof value === "object") {
			return Object.fromEntries(
				Object.entries(value).map(([key, val]) => [key, serialize(val)]),
			);
		}

		return value;
	}

	function deserialize(value: unknown): unknown {
		for (const serializer of serializers) {
			if (serializer.isSerialized(value)) {
				return serializer.deserialize(value);
			}
		}

		if (!value) return value;

		if (Array.isArray(value)) {
			return value.map((val: unknown) => deserialize(val));
		}

		if (value instanceof Error) return Error;

		if (typeof value === "object") {
			return Object.fromEntries(
				Object.entries(value).map(([key, val]) => [key, deserialize(val)]),
			);
		}

		return value;
	}

	return { serialize, deserialize };
}

export type DefineElectronTipc<TDefinitions extends ElectronTipcDefinitions> =
	TDefinitions;

export type ElectronTipcQuery<TResponse = unknown, TArg = unknown> = {
	operation: "query";
	arg: TArg;
	response: TResponse;
};

export type ElectronTipcMutation<TResponse = unknown, TArg = unknown> = {
	operation: "mutation";
	arg: TArg;
	response: TResponse;
};

export type ElectronTipcSendFromMain<TPayload = unknown> = {
	operation: "sendFromMain";
	payload: TPayload;
};

export type ElectronTipcSendRenderer<TPayload = unknown> = {
	operation: "sendFromRenderer";
	payload: TPayload;
};

export type ElectronTipcDefinitions = Record<string, ElectronTipcOperation>;

export type ElectronTipcMain<TDefinitions extends ElectronTipcDefinitions> = {
	[TName in keyof TDefinitions]: TDefinitions[TName] extends ElectronTipcQuery
		? {
				handleQuery: (
					handler: (
						event: Parameters<Parameters<IpcMain["handle"]>[1]>[0],
						...args: keyof TDefinitions[TName]["arg"] extends never
							? []
							: [arg: TDefinitions[TName]["arg"]]
					) =>
						| TDefinitions[TName]["response"]
						| Promise<TDefinitions[TName]["response"]>,
				) => ElectronTipcRemoveHandlerFn;
			}
		: TDefinitions[TName] extends ElectronTipcMutation
			? {
					handleMutation: (
						handler: (
							event: Parameters<Parameters<IpcMain["handle"]>[1]>[0],
							...args: keyof TDefinitions[TName]["arg"] extends never
								? []
								: [arg: TDefinitions[TName]["arg"]]
						) =>
							| TDefinitions[TName]["response"]
							| Promise<TDefinitions[TName]["response"]>,
					) => ElectronTipcRemoveHandlerFn;
				}
			: TDefinitions[TName] extends ElectronTipcSendFromMain
				? {
						send: (
							browserWindows: BrowserWindow[],
							payload: TDefinitions[TName]["payload"],
						) => void;
						sendToFrame: (
							browserWindows: BrowserWindow[],
							frame: Parameters<WebContents["sendToFrame"]>[0],
							payload: TDefinitions[TName]["payload"],
						) => void;
					}
				: TDefinitions[TName] extends ElectronTipcSendRenderer
					? ElectronTipcSubscriber<
							Parameters<Parameters<IpcMain["addListener"]>[1]>[0],
							TDefinitions[TName]["payload"]
						>
					: never;
};

export type TIPCRenderer<TDefinitions extends ElectronTipcDefinitions> = {
	[TName in keyof TDefinitions]: TDefinitions[TName] extends ElectronTipcQuery
		? {
				invoke: (
					...args: keyof TDefinitions[TName]["arg"] extends never
						? []
						: [arg: TDefinitions[TName]["arg"]]
				) => Promise<TDefinitions[TName]["response"]>;
			}
		: TDefinitions[TName] extends ElectronTipcSendRenderer
			? {
					send: (payload: TDefinitions[TName]["payload"]) => void;
					sendToHost: (payload: TDefinitions[TName]["payload"]) => void;
				}
			: TDefinitions[TName] extends ElectronTipcSendFromMain
				? ElectronTipcSubscriber<
						Parameters<Parameters<IpcRenderer["addListener"]>[1]>[0],
						TDefinitions[TName]["payload"]
					>
				: never;
};

export type Serializer = {
	serialize: (val: unknown) => unknown;
	deserialize: (val: unknown) => unknown;
};

export type ValueSerializer<TValue, TSerialized> = {
	isDeserialized: (value: unknown) => value is TValue;
	isSerialized: (value: unknown) => value is TSerialized;
	serialize: (value: TValue) => TSerialized;
	deserialize: (value: TSerialized) => TValue;
};

export type Logger = {
	debug: (...args: unknown[]) => unknown;
	verbose: (...args: unknown[]) => unknown;
	info: (...args: unknown[]) => unknown;
	warn: (...args: unknown[]) => unknown;
	error: (...args: unknown[]) => unknown;
};

type ElectronTipcSubscriber<TEvent, TPayload> = {
	subscribe: (
		listener: ElectronTipcListener<TEvent, TPayload>,
	) => ElectronTipcUnsubscribeFn;
};

export type ElectronTipcOperation =
	| ElectronTipcQuery
	| ElectronTipcMutation
	| ElectronTipcSendFromMain
	| ElectronTipcSendRenderer;

type ElectronTipcListener<TEvent, TPayload> = (
	event: TEvent,
	payload: TPayload,
) => void | Promise<void>;

type ElectronTipcRemoveHandlerFn = () => void;

type ElectronTipcUnsubscribeFn = () => void;
