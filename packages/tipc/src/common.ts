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

export function exhaustive(param: never, logger?: Logger) {
	// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
	logger?.warn(`unknown value ${param}`);
}

export type DefineTIPC<TDefinitions extends TIPCDefinitions> = TDefinitions;

export type TIPCInvokeQuery<TResponse = unknown, TArg = unknown> = {
	operation: "invokeQuery";
	arg: TArg;
	response: TResponse;
};

export type TIPCInvokeMutation<TResponse = unknown, TArg = unknown> = {
	operation: "invokeMutation";
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
	[TName in keyof TDefinitions]: TDefinitions[TName] extends TIPCInvokeQuery
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
				) => TIPCRemoveHandlerFn;
			}
		: TDefinitions[TName] extends TIPCInvokeMutation
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
					? {
							subscribe: (
								listener: TIPCHandler<
									Parameters<Parameters<IpcMain["addListener"]>[1]>[0],
									TDefinitions[TName]["payload"]
								>,
							) => TIPCUnsubscribeFn;
						}
					: never;
};

export type TIPCRenderer<TDefinitions extends TIPCDefinitions> = {
	[TName in keyof TDefinitions]: TDefinitions[TName] extends TIPCInvokeQuery
		? {
				query: (
					...args: keyof TDefinitions[TName]["arg"] extends never
						? []
						: [arg: TDefinitions[TName]["arg"]]
				) => Promise<TDefinitions[TName]["response"]>;
			}
		: TDefinitions[TName] extends TIPCInvokeMutation
			? {
					mutate: (
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
					? {
							subscribe: (
								listener: TIPCHandler<
									Parameters<Parameters<IpcRenderer["addListener"]>[1]>[0],
									TDefinitions[TName]["payload"]
								>,
							) => TIPCUnsubscribeFn;
						}
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

export type TIPCOperation =
	| TIPCInvokeQuery
	| TIPCInvokeMutation
	| TIPCSendMain
	| TIPCSendRenderer;

export type TIPCMainMethod = KeysOfUnion<
	TIPCMain<AnyDef>[keyof TIPCRenderer<AnyDef>]
>;

export type TIPCRendererMethod = KeysOfUnion<
	TIPCRenderer<AnyDef>[keyof TIPCRenderer<AnyDef>]
>;

type TIPCHandler<TEvent, TPayload> = (
	event: TEvent,
	payload: TPayload,
) => void | Promise<void>;

type TIPCRemoveHandlerFn = () => void;

type TIPCUnsubscribeFn = () => void;

type AnyDef = {
	query: TIPCInvokeQuery;
	mutation: TIPCInvokeMutation;
	sendMain: TIPCSendMain;
	sendRender: TIPCSendRenderer;
};

type KeysOfUnion<T> = T extends T ? keyof T : never;
