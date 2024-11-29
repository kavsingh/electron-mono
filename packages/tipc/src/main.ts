import type { Serializer, TIPCDefinitions } from "./common";
import type {
	BrowserWindow,
	IpcMain,
	IpcMainEvent,
	IpcMainInvokeEvent,
} from "electron";

export function createTIPCMain<TDefinitions extends TIPCDefinitions>(
	ipcMain: IpcMain,
	serializer: Serializer,
) {
	type Invoke = TDefinitions["invoke"];
	type MainEvents = TDefinitions["mainEvents"];
	type RendererEvents = TDefinitions["rendererEvents"];

	function handle<TChannel extends string & keyof Invoke>(
		channel: TChannel,
		handler: (
			event: IpcMainInvokeEvent,
			args: Invoke[TChannel][0],
		) => Invoke[TChannel][1] | Promise<Invoke[TChannel][1]>,
	) {
		ipcMain.handle(channel, async (event, arg) => {
			const result = await handler(
				event,
				serializer.deserialize(arg) as Invoke[TChannel][0],
			);

			return serializer.serialize(result);
		});

		return function removeHandler() {
			ipcMain.removeHandler(channel);
		};
	}

	function send<TChannel extends string & keyof MainEvents>(
		windows: BrowserWindow[],
		channel: TChannel,
		payload: MainEvents[TChannel],
	) {
		for (const win of windows) {
			if (!win.isDestroyed()) {
				win.webContents.send(channel, serializer.serialize(payload));
			}
		}
	}

	function subscribe<TChannel extends string & keyof RendererEvents>(
		channel: TChannel,
		handler: (
			event: IpcMainEvent,
			payload: RendererEvents[TChannel],
		) => void | PromiseLike<void>,
	) {
		function eventHandler(event: IpcMainEvent, payload: unknown) {
			void handler(
				event,
				serializer.deserialize(payload) as RendererEvents[TChannel],
			);
		}

		ipcMain.addListener(channel, eventHandler);

		return function unsubscribe() {
			ipcMain.removeListener(channel, eventHandler);
		};
	}

	return { handle, send, subscribe } as const;
}
