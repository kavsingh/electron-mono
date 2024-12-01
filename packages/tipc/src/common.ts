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

type TIPCListener<TEvent, TPayload> = {
	subscribe: (listener: TIPCHandler<TEvent, TPayload>) => TIPCUnsubscribeFn;
};

type TIPCOperation = TIPCInvoke | TIPCSendMain | TIPCSendRenderer;

type TIPCHandler<TEvent, TPayload> = (
	event: TEvent,
	payload: TPayload,
) => void | Promise<void>;

type TIPCRemoveHandlerFn = () => void;

type TIPCUnsubscribeFn = () => void;
