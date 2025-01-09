import type {
	BrowserWindow,
	IpcMain,
	IpcRenderer,
	WebContents,
} from "electron";

export const ELECTRON_TYPED_IPC_GLOBAL_NAMESPACE = "__ELECTRON_TYPED_IPC__";

export function scopeChannel(
	channel: `${string}/${TypedIpcOperation["operation"]}`,
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

export type DefineTypedIpc<TDefinitions extends TypedIpcDefinitions> =
	TDefinitions;

export type TypedIpcQuery<TResponse = unknown, TArg = unknown> = {
	operation: "query";
	arg: TArg;
	response: TResponse;
};

export type TypedIpcMutation<TResponse = unknown, TArg = unknown> = {
	operation: "mutation";
	arg: TArg;
	response: TResponse;
};

export type TypedIpcSendFromMain<TPayload = unknown> = {
	operation: "sendFromMain";
	payload: TPayload;
};

export type TypedIpcSendFromRenderer<TPayload = unknown> = {
	operation: "sendFromRenderer";
	payload: TPayload;
};

export type TypedIpcSendFromMainOptions = {
	frames?: Parameters<WebContents["sendToFrame"]>[0] | undefined;
	getTargetWindows?: (() => BrowserWindow[]) | undefined;
};

export type TypedIpcSendFromRendererOptions = {
	toHost?: boolean | undefined;
};

export type TypedIpcDefinitions = Readonly<Record<string, TypedIpcOperation>>;

export type TypedIpcMain<TDefinitions extends TypedIpcDefinitions> = Readonly<{
	[TName in keyof TDefinitions]: TDefinitions[TName] extends TypedIpcQuery
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
				) => TypedIpcRemoveHandlerFn;
			}
		: TDefinitions[TName] extends TypedIpcMutation
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
					) => TypedIpcRemoveHandlerFn;
				}
			: TDefinitions[TName] extends TypedIpcSendFromMain
				? {
						send: (
							payload: keyof TDefinitions[TName]["payload"] extends never
								? undefined
								: TDefinitions[TName]["payload"],
							options?: TypedIpcSendFromMainOptions,
						) => void;
					}
				: TDefinitions[TName] extends TypedIpcSendFromRenderer
					? {
							subscribe: (
								listener: TypedIpcListener<
									Parameters<Parameters<IpcMain["addListener"]>[1]>[0],
									TDefinitions[TName]["payload"]
								>,
							) => TypedIpcUnsubscribeFn;
						}
					: never;
}>;

export type TypedIpcRenderer<TDefinitions extends TypedIpcDefinitions> =
	Readonly<{
		[TName in keyof TDefinitions]: TDefinitions[TName] extends TypedIpcQuery
			? {
					query: (
						...args: keyof TDefinitions[TName]["arg"] extends never
							? []
							: [arg: TDefinitions[TName]["arg"]]
					) => Promise<TDefinitions[TName]["response"]>;
				}
			: TDefinitions[TName] extends TypedIpcMutation
				? {
						mutate: (
							...args: keyof TDefinitions[TName]["arg"] extends never
								? []
								: [arg: TDefinitions[TName]["arg"]]
						) => Promise<TDefinitions[TName]["response"]>;
					}
				: TDefinitions[TName] extends TypedIpcSendFromRenderer
					? {
							send: (
								...args: keyof TDefinitions[TName]["payload"] extends never
									? [undefined, TypedIpcSendFromRendererOptions]
									: [
											TDefinitions[TName]["payload"],
											TypedIpcSendFromRendererOptions,
										]
							) => void;
						}
					: TDefinitions[TName] extends TypedIpcSendFromMain
						? {
								subscribe: (
									listener: TypedIpcListener<
										Parameters<Parameters<IpcRenderer["addListener"]>[1]>[0],
										TDefinitions[TName]["payload"]
									>,
								) => TypedIpcUnsubscribeFn;
							}
						: never;
	}>;

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

export type TypedIpcOperation =
	| TypedIpcQuery
	| TypedIpcMutation
	| TypedIpcSendFromMain
	| TypedIpcSendFromRenderer;

export type TypedIpcMainMethod = KeysOfUnion<
	TypedIpcMain<AnyDef>[keyof TypedIpcRenderer<AnyDef>]
>;

export type TypedIpcRendererMethod = KeysOfUnion<
	TypedIpcRenderer<AnyDef>[keyof TypedIpcRenderer<AnyDef>]
>;

type TypedIpcListener<TEvent, TPayload> = (
	...args: keyof TPayload extends never
		? [event: TEvent]
		: [event: TEvent, payload: TPayload]
) => void | Promise<void>;

type TypedIpcRemoveHandlerFn = () => void;

type TypedIpcUnsubscribeFn = () => void;

type AnyDef = {
	query: TypedIpcQuery;
	mutation: TypedIpcMutation;
	sendMain: TypedIpcSendFromMain;
	sendRender: TypedIpcSendFromRenderer;
};

type KeysOfUnion<T> = T extends T ? keyof T : never;
