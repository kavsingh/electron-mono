import { defaultSerializer, scopeChannel } from "./common";
import { exhaustive } from "./internal";

import type {
	Logger,
	Serializer,
	TypedIpcDefinitions,
	TypedIpcMain,
	TypedIpcMainMethod,
} from "./common";
import type { TypedIpcResult } from "./internal";
import type { BrowserWindow, IpcMain } from "electron";

export function createTypedIpcMain<TDefinitions extends TypedIpcDefinitions>(
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
				async (event, arg: unknown): Promise<TypedIpcResult> => {
					logger?.debug("handle query", { scopedChannel, arg });

					try {
						const result: TypedIpcResult = {
							__r: "ok",
							data: await handler(event, serializer.deserialize(arg)),
						};

						logger?.debug("handle query result", { scopedChannel, result });

						return result;
					} catch (reason) {
						const error =
							reason instanceof Error ? reason : new Error(String(reason));
						const result: TypedIpcResult = {
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
				async (event, arg: unknown): Promise<TypedIpcResult> => {
					logger?.debug("handle mutation", { scopedChannel, arg });

					try {
						const result: TypedIpcResult = {
							__r: "ok",
							data: await handler(event, serializer.deserialize(arg)),
						};

						logger?.debug("handle mutation result", { scopedChannel, result });

						return result;
					} catch (reason) {
						const error =
							reason instanceof Error ? reason : new Error(String(reason));
						const result: TypedIpcResult = {
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
		apply: (_, __, [windows, payload]: [BrowserWindow[], unknown]) => {
			const scoped = scopeChannel(`${currentChannel}/sendFromMain`);
			const serialized = serializer.serialize(payload);

			logger?.debug("send main", { scoped, windows, serialized });

			for (const win of windows) {
				if (!win.isDestroyed()) {
					win.webContents.send(scoped, serialized);
				}
			}
		},
	});

	const sendToFrameProxy = new Proxy(proxyFn, {
		apply: (
			_,
			__,
			[windows, frame, payload]: [
				BrowserWindow[],
				number | [number, number],
				unknown,
			],
		) => {
			const scoped = scopeChannel(`${currentChannel}/sendFromMain`);
			const serialized = serializer.serialize(payload);

			logger?.debug("send to frame main", { scoped, windows, serialized });

			for (const win of windows) {
				if (!win.isDestroyed()) {
					win.webContents.sendToFrame(frame, scoped, serialized);
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

			const op = operation as TypedIpcMainMethod;

			switch (op) {
				case "handleQuery":
					return handleQueryProxy;

				case "handleMutation":
					return handleMutationProxy;

				case "send":
					return sendProxy;

				case "sendToFrame":
					return sendToFrameProxy;

				case "subscribe":
					return subscribeProxy;

				default: {
					exhaustive(op, logger);

					return undefined;
				}
			}
		},
	});

	return new Proxy(proxyObj as unknown as TypedIpcMain<TDefinitions>, {
		get: (_, channel) => {
			if (typeof channel !== "string") return undefined;

			currentChannel = channel;

			return operationsProxy;
		},
	});
}
