import { defaultSerializer, scopedChannel } from "./common";

import type { Serializer, TIPCDefinitions, TIPCMain } from "./common";
import type { BrowserWindow, IpcMain } from "electron";

export function createTIPCMain<TDefinitions extends TIPCDefinitions>(
	ipcMain: IpcMain,
	options?: { serializer?: Serializer | undefined },
) {
	const serializer = options?.serializer ?? defaultSerializer;

	const handleProxy = new Proxy(
		{},
		{
			get: (_, channel) => {
				return new Proxy(() => undefined, {
					apply: (__, ___, [handler]: [(...args: unknown[]) => unknown]) => {
						ipcMain.handle(
							scopedChannel(`invoke/${channel as string}`),
							async (event, arg) => {
								const result = await handler(
									event,
									serializer.deserialize(arg),
								);

								return serializer.serialize(result);
							},
						);

						return function removeHandler() {
							ipcMain.removeHandler(channel as string);
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
				return new Proxy(() => undefined, {
					apply: (__, ___, [windows, payload]: [BrowserWindow[], unknown]) => {
						for (const win of windows) {
							if (!win.isDestroyed()) {
								win.webContents.send(
									scopedChannel(`eventsMain/${channel as string}`),
									serializer.serialize(payload),
								);
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
				return new Proxy(() => undefined, {
					apply: (__, ___, [handler]: [(...args: unknown[]) => unknown]) => {
						function eventHandler(event: unknown, payload: unknown) {
							void handler(event, serializer.deserialize(payload));
						}

						const scoped = scopedChannel(`eventsRenderer/${channel as string}`);

						ipcMain.addListener(scoped, eventHandler);

						return function unsubscribe() {
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
