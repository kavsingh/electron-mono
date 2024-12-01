import { defaultSerializer, scopeChannel } from "./common";

import type { Logger, Serializer, TIPCDefinitions, TIPCMain } from "./common";
import type { BrowserWindow, IpcMain } from "electron";

export function createTIPCMain<TDefinitions extends TIPCDefinitions>(
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

	const handleProxy = new Proxy(proxyFn, {
		apply: (_, __, [handler]: [(...args: unknown[]) => unknown]) => {
			const scopedChannel = scopeChannel(`${currentChannel}/invoke`);

			logger?.debug("add handler", { scopedChannel, handler });

			ipcMain.handle(scopedChannel, async (event, arg: unknown) => {
				logger?.debug("handle", { scopedChannel, arg });

				const result = await handler(event, serializer.deserialize(arg));

				return serializer.serialize(result);
			});

			return function removeHandler() {
				ipcMain.removeHandler(scopedChannel);
			};
		},
	});

	const sendProxy = new Proxy(proxyFn, {
		apply: (_, __, [windows, payload]: [BrowserWindow[], unknown]) => {
			const scoped = scopeChannel(`${currentChannel}/sendMain`);
			const serialized = serializer.serialize(payload);

			logger?.debug("publish", { scoped, windows, serialized });

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
			const scoped = scopeChannel(`${currentChannel}/sendMain`);
			const serialized = serializer.serialize(payload);

			logger?.debug("publish", { scoped, windows, serialized });

			for (const win of windows) {
				if (!win.isDestroyed()) {
					win.webContents.sendToFrame(frame, scoped, serialized);
				}
			}
		},
	});

	const subscribeProxy = new Proxy(proxyFn, {
		apply: (_, __, [handler]: [(...args: unknown[]) => unknown]) => {
			const scopedChannel = scopeChannel(`${currentChannel}/sendRenderer`);

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

			switch (operation) {
				case "handle":
					return handleProxy;

				case "send":
					return sendProxy;

				case "sendToFrame":
					return sendToFrameProxy;

				case "subscribe":
					return subscribeProxy;

				default:
					return undefined;
			}
		},
	});

	return new Proxy(proxyObj as unknown as TIPCMain<TDefinitions>, {
		get: (_, channel) => {
			if (typeof channel !== "string") return undefined;

			currentChannel = channel;

			return operationsProxy;
		},
	});
}
