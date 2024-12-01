import { defaultSerializer, scopedChannel } from "./common";

import type { Logger, Serializer, TIPCDefinitions, TIPCMain } from "./common";
import type { BrowserWindow, IpcMain } from "electron";

export function createTIPCMain<TDefinitions extends TIPCDefinitions>(
	ipcMain: IpcMain,
	options?: {
		serializer?: Serializer | undefined;
		logger?: Logger | undefined;
	},
) {
	const serializer = options?.serializer ?? defaultSerializer;
	const logger = options?.logger;

	const handleProxy = new Proxy(
		{},
		{
			get: (_, channel) => {
				const scoped = scopedChannel(`invoke/${channel as string}`);

				return new Proxy(() => undefined, {
					apply: (__, ___, [handler]: [(...args: unknown[]) => unknown]) => {
						logger?.debug("add handler", { scoped, handler });

						ipcMain.handle(scoped, async (event, arg: unknown) => {
							logger?.debug("handle", { scoped, arg });

							const result = await handler(event, serializer.deserialize(arg));

							return serializer.serialize(result);
						});

						return function removeHandler() {
							ipcMain.removeHandler(scoped);
						};
					},
				});
			},
		},
	);

	const publishProxy = new Proxy(
		{},
		{
			get: (_, channel) => {
				const scoped = scopedChannel(`eventsMain/${channel as string}`);

				return new Proxy(() => undefined, {
					apply: (__, ___, [windows, payload]: [BrowserWindow[], unknown]) => {
						const serialized = serializer.serialize(payload);

						logger?.debug("publish", { scoped, windows, serialized });

						for (const win of windows) {
							if (!win.isDestroyed()) {
								win.webContents.send(scoped, serialized);
							}
						}
					},
				});
			},
		},
	);

	const subscribeProxy = new Proxy(
		{},
		{
			get: (_, channel) => {
				const scoped = scopedChannel(`eventsRenderer/${channel as string}`);

				return new Proxy(() => undefined, {
					apply: (__, ___, [handler]: [(...args: unknown[]) => unknown]) => {
						function eventHandler(event: unknown, payload: unknown) {
							logger?.debug("subscribe handler", { scoped, payload });
							void handler(event, serializer.deserialize(payload));
						}

						logger?.debug("subscribe", { scoped, handler });
						ipcMain.addListener(scoped, eventHandler);

						return function unsubscribe() {
							logger?.debug("unsubscribe", { scoped, handler });
							ipcMain.removeListener(scoped, eventHandler);
						};
					},
				});
			},
		},
	);

	return new Proxy({} as unknown as TIPCMain<TDefinitions>, {
		get: (_, operation) => {
			switch (operation as keyof TIPCMain<TDefinitions>) {
				case "handle":
					return handleProxy;

				case "publish":
					return publishProxy;

				case "subscribe":
					return subscribeProxy;
			}
		},
	});
}
