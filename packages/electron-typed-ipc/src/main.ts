import { BrowserWindow } from "electron";

import { defaultSerializer } from "./common";
import { exhaustive, scopeChannel } from "./internal";

import type {
	Logger,
	Serializer,
	ElectronTypedIpcSchema,
	Query,
	RemoveHandlerFn,
	Mutation,
	SendFromMain,
	SendFromRenderer,
	UnsubscribeFn,
} from "./common";
import type { AnySchema, IpcPreloadResult, KeysOfUnion } from "./internal";
import type { IpcMain, IpcMainEvent, WebContents } from "electron";

export function createElectronTypedIpcMain<
	TDefinitions extends ElectronTypedIpcSchema,
>(
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
	let currentChannel = "__";

	const handleQueryProxy = new Proxy(proxyFn, {
		apply: (_, __, [handler]: [(...args: unknown[]) => unknown]) => {
			const scopedChannel = scopeChannel(`${currentChannel}/query`);

			logger?.debug("add query handler", { scopedChannel, handler });

			ipcMain.handle(
				scopedChannel,
				async (event, arg: unknown): Promise<IpcPreloadResult> => {
					logger?.debug("handle query", { scopedChannel, arg });

					try {
						const result: IpcPreloadResult = {
							__r: "ok",
							data: await handler(event, serializer.deserialize(arg)),
						};

						logger?.debug("handle query result", { scopedChannel, result });

						return result;
					} catch (reason) {
						const error =
							reason instanceof Error ? reason : new Error(String(reason));
						const result: IpcPreloadResult = {
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

	const handleMutationProxy = new Proxy(proxyFn, {
		apply: (_, __, [handler]: [(...args: unknown[]) => unknown]) => {
			const scopedChannel = scopeChannel(`${currentChannel}/mutation`);

			logger?.debug("add mutation handler", { scopedChannel, handler });

			ipcMain.handle(
				scopedChannel,
				async (event, arg: unknown): Promise<IpcPreloadResult> => {
					logger?.debug("handle mutation", { scopedChannel, arg });

					try {
						const result: IpcPreloadResult = {
							__r: "ok",
							data: await handler(event, serializer.deserialize(arg)),
						};

						logger?.debug("handle mutation result", { scopedChannel, result });

						return result;
					} catch (reason) {
						const error =
							reason instanceof Error ? reason : new Error(String(reason));
						const result: IpcPreloadResult = {
							__r: "error",
							error: serializer.serialize(error),
						};

						logger?.debug("handle mutation result", { scopedChannel, result });

						return result;
					}
				},
			);

			return function removeHandler() {
				ipcMain.removeHandler(scopedChannel);
			};
		},
	});

	const sendProxy = new Proxy(proxyFn, {
		apply: (
			_,
			__,
			[payload, sendOptions]: [unknown, SendFromMainOptions | undefined],
		) => {
			const scoped = scopeChannel(`${currentChannel}/sendFromMain`);
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

	const subscribeProxy = new Proxy(proxyFn, {
		apply: (_, __, [handler]: [(...args: unknown[]) => unknown]) => {
			const scopedChannel = scopeChannel(`${currentChannel}/sendFromRenderer`);

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

	const operationsProxy = new Proxy(proxyObj, {
		get: (_, operation) => {
			if (typeof operation !== "string") return undefined;

			const op = operation as MainProxyMethod;

			switch (op) {
				case "handleQuery":
					return handleQueryProxy;

				case "handleMutation":
					return handleMutationProxy;

				case "send":
					return sendProxy;

				case "subscribe":
					return subscribeProxy;

				default: {
					exhaustive(op, logger);

					return undefined;
				}
			}
		},
	});

	return new Proxy(proxyObj as unknown as ElectronTypedIpcMain<TDefinitions>, {
		get: (_, channel) => {
			if (typeof channel !== "string") return undefined;

			currentChannel = channel;

			return operationsProxy;
		},
	});
}

export type ElectronTypedIpcMain<TDefinitions extends ElectronTypedIpcSchema> =
	Readonly<{
		[TName in keyof TDefinitions]: TDefinitions[TName] extends Query
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
			: TDefinitions[TName] extends Mutation
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
				: TDefinitions[TName] extends SendFromMain
					? {
							send: (
								payload: keyof TDefinitions[TName]["payload"] extends never
									? undefined
									: TDefinitions[TName]["payload"],
								options?: SendFromMainOptions,
							) => void;
						}
					: TDefinitions[TName] extends SendFromRenderer
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
