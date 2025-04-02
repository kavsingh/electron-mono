import { BrowserWindow } from "electron";

import { exhaustive, scopeChannel } from "./internal";
import { defaultSerializer } from "./serializer";

import type {
	AnySchema,
	IpcResult,
	KeysOfUnion,
	RemoveHandlerFn,
	UnsubscribeFn,
	Schema,
	Query,
	Mutation,
	SendFromMain,
	SendFromRenderer,
	Definition,
	OperationWithChannel,
} from "./internal";
import type { Logger } from "./logger";
import type { Serializer } from "./serializer";
import type { IpcMain, IpcMainEvent, WebContents } from "electron";

export function createElectronTypedIpcMain<TSchema extends Schema<Definition>>(
	ipcMain: IpcMain,
	options?: {
		serializer?: Serializer | undefined;
		logger?: Logger | undefined;
	},
) {
	const proxyObj = {};
	const proxyFn = () => undefined;
	const serializer = options?.serializer ?? defaultSerializer;
	const logger = options?.logger;

	function handleQueryProxy(channel: string) {
		return new Proxy(proxyFn, {
			apply: (_, __, [handler]: [(...args: unknown[]) => unknown]) => {
				const scopedChannel = scopeChannel(`${channel}/query`);

				logger?.debug("add query handler", { scopedChannel, handler });

				ipcMain.handle(
					scopedChannel,
					async (event, arg: unknown): Promise<IpcResult> => {
						logger?.debug("handle query", { scopedChannel, arg });

						try {
							const result: IpcResult = {
								__r: "ok",
								data: await handler(event, serializer.deserialize(arg)),
							};

							logger?.debug("handle query result", { scopedChannel, result });

							return result;
						} catch (reason) {
							const error =
								reason instanceof Error ? reason : new Error(String(reason));
							const result: IpcResult = {
								__r: "error",
								error: serializer.serialize(error),
							};

							logger?.debug("handle query result", { scopedChannel, result });

							return result;
						}
					},
				);

				return function removeHandler() {
					ipcMain.removeHandler(scopedChannel);
				};
			},
		});
	}

	function handleMutationProxy(channel: string) {
		return new Proxy(proxyFn, {
			apply: (_, __, [handler]: [(...args: unknown[]) => unknown]) => {
				const scopedChannel = scopeChannel(`${channel}/mutation`);

				logger?.debug("add mutation handler", { scopedChannel, handler });

				ipcMain.handle(
					scopedChannel,
					async (event, arg: unknown): Promise<IpcResult> => {
						logger?.debug("handle mutation", { scopedChannel, arg });

						try {
							const result: IpcResult = {
								__r: "ok",
								data: await handler(event, serializer.deserialize(arg)),
							};

							logger?.debug("handle mutation result", {
								scopedChannel,
								result,
							});

							return result;
						} catch (reason) {
							const error =
								reason instanceof Error ? reason : new Error(String(reason));
							const result: IpcResult = {
								__r: "error",
								error: serializer.serialize(error),
							};

							logger?.debug("handle mutation result", {
								scopedChannel,
								result,
							});

							return result;
						}
					},
				);

				return function removeHandler() {
					ipcMain.removeHandler(scopedChannel);
				};
			},
		});
	}

	function sendProxy(channel: string) {
		return new Proxy(proxyFn, {
			apply: (
				_,
				__,
				[payload, sendOptions]: [unknown, SendFromMainOptions | undefined],
			) => {
				const scoped = scopeChannel(`${channel}/sendFromMain`);
				const serialized = serializer.serialize(payload);
				const targetWindows =
					sendOptions?.getTargetWindows?.() ?? BrowserWindow.getAllWindows();

				logger?.debug("send main", { scoped, targetWindows, serialized });

				for (const win of targetWindows) {
					if (win.isDestroyed()) continue;

					if (sendOptions?.frames !== undefined) {
						win.webContents.sendToFrame(sendOptions.frames, scoped, serialized);
					} else {
						win.webContents.send(scoped, serialized);
					}
				}
			},
		});
	}

	function subscribeProxy(channel: string) {
		return new Proxy(proxyFn, {
			apply: (_, __, [handler]: [(...args: unknown[]) => unknown]) => {
				const scopedChannel = scopeChannel(`${channel}/sendFromRenderer`);

				function eventHandler(event: unknown, payload: unknown) {
					logger?.debug("subscribe handler", { scopedChannel, payload });
					void handler(event, serializer.deserialize(payload));
				}

				logger?.debug("subscribe", { scopedChannel, handler });
				ipcMain.addListener(scopedChannel, eventHandler);

				return function unsubscribe() {
					logger?.debug("unsubscribe", { scopedChannel, handler });
					ipcMain.removeListener(scopedChannel, eventHandler);
				};
			},
		});
	}

	function operationsProxy(channel: string) {
		return new Proxy(proxyObj, {
			get: (_, operation) => {
				if (typeof operation !== "string") return undefined;

				const op = operation as MainProxyMethod;

				switch (op) {
					case "handleQuery": {
						return handleQueryProxy(channel);
					}

					case "handleMutation": {
						return handleMutationProxy(channel);
					}

					case "send":
						return sendProxy(channel);

					case "subscribe":
						return subscribeProxy(channel);

					default: {
						exhaustive(op, logger);

						return undefined;
					}
				}
			},
		});
	}

	return new Proxy(proxyObj as unknown as ElectronTypedIpcMain<TSchema>, {
		get: (_, channel) => {
			if (typeof channel !== "string") return undefined;

			return operationsProxy(channel);
		},
	});
}

export type ElectronTypedIpcMain<TDefinitions extends Schema<Definition>> =
	Readonly<{
		[TName in keyof TDefinitions]: TDefinitions[TName] extends OperationWithChannel<Query>
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
					) => RemoveHandlerFn;
				}
			: TDefinitions[TName] extends OperationWithChannel<Mutation>
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
						) => RemoveHandlerFn;
					}
				: TDefinitions[TName] extends OperationWithChannel<SendFromMain>
					? {
							send: (
								payload: keyof TDefinitions[TName]["payload"] extends never
									? undefined
									: TDefinitions[TName]["payload"],
								options?: SendFromMainOptions,
							) => void;
						}
					: TDefinitions[TName] extends OperationWithChannel<SendFromRenderer>
						? {
								subscribe: (
									listener: (
										...args: keyof TDefinitions[TName]["payload"] extends never
											? [event: IpcMainEvent]
											: [
													event: IpcMainEvent,
													payload: TDefinitions[TName]["payload"],
												]
									) => void | Promise<void>,
								) => UnsubscribeFn;
							}
						: never;
	}>;

export type SendFromMainOptions = {
	frames?: Parameters<WebContents["sendToFrame"]>[0] | undefined;
	getTargetWindows?: (() => BrowserWindow[]) | undefined;
};

type MainProxyMethod = KeysOfUnion<
	ElectronTypedIpcMain<AnySchema>[keyof ElectronTypedIpcMain<AnySchema>]
>;
