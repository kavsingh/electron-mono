import type {
	BrowserWindow,
	IpcMain,
	IpcRenderer,
	WebContents,
} from "electron";

export const TIPC_GLOBAL_NAMESPACE = "__TIPC_API__";

export function scopeChannel(
	channel: `${string}/${TIPCOperation["operation"]}`,
) {
	return `__tipc__/${channel}` as const;
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

export type DefineTIPC<TDefinitions extends TIPCDefinitions> = TDefinitions;

export type TIPCInvoke<TResponse = unknown, TArg = unknown> = {
	operation: "invoke";
	arg: TArg;
	response: TResponse;
};

export type TIPCSendMain<TPayload = unknown> = {
	operation: "sendMain";
	payload: TPayload;
};

export type TIPCSendRenderer<TPayload = unknown> = {
	operation: "sendRenderer";
	payload: TPayload;
};

export type TIPCDefinitions = Record<string, TIPCOperation>;

export type TIPCMain<TDefinitions extends TIPCDefinitions> = {
	[TName in keyof TDefinitions]: TDefinitions[TName] extends TIPCInvoke
		? {
				handle: (
					handler: (
						event: Parameters<Parameters<IpcMain["handle"]>[1]>[0],
						...args: keyof TDefinitions[TName]["arg"] extends never
							? []
							: [arg: TDefinitions[TName]["arg"]]
					) =>
						| TDefinitions[TName]["response"]
						| Promise<TDefinitions[TName]["response"]>,
				) => TIPCRemoveHandlerFn;
			}
		: TDefinitions[TName] extends TIPCSendMain
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
			: TDefinitions[TName] extends TIPCSendRenderer
				? TIPCListener<
						Parameters<Parameters<IpcMain["addListener"]>[1]>[0],
						TDefinitions[TName]["payload"]
					>
				: never;
};

export type TIPCRenderer<TDefinitions extends TIPCDefinitions> = {
	[TName in keyof TDefinitions]: TDefinitions[TName] extends TIPCInvoke
		? {
				invoke: (
					...args: keyof TDefinitions[TName]["arg"] extends never
						? []
						: [arg: TDefinitions[TName]["arg"]]
				) => Promise<TDefinitions[TName]["response"]>;
			}
		: TDefinitions[TName] extends TIPCSendRenderer
			? {
					send: (payload: TDefinitions[TName]["payload"]) => void;
					sendToHost: (payload: TDefinitions[TName]["payload"]) => void;
				}
			: TDefinitions[TName] extends TIPCSendMain
				? TIPCListener<
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

type TIPCListener<TEvent, TPayload> = {
	subscribe: (listener: TIPCHandler<TEvent, TPayload>) => TIPCUnsubscribeFn;
};

export type TIPCOperation = TIPCInvoke | TIPCSendMain | TIPCSendRenderer;

type TIPCHandler<TEvent, TPayload> = (
	event: TEvent,
	payload: TPayload,
) => void | Promise<void>;

type TIPCRemoveHandlerFn = () => void;

type TIPCUnsubscribeFn = () => void;
