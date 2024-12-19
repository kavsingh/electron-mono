import type { BrowserWindow, IpcMainEvent } from "electron";

export function createTipcMain() {}

type TIPCMainHandleQuery<TReturn = unknown, TArg = void> = (
	arg: TArg,
) => TReturn | Promise<TReturn>;

type TIPCMainHandleMutation<TReturn = unknown, TArg = void> = (
	arg: TArg,
) => TReturn | Promise<TReturn>;

type TIPCMainSend<TPayload = unknown> = (
	windows: BrowserWindow[],
	payload: TPayload,
) => void;

type TIPCMainSubscribe<TPayload = unknown> = (
	handler: (event: IpcMainEvent, payload: TPayload) => void | Promise<void>,
) => () => void;

type TIPCMainMethod = {
	handleQuery: TIPCMainHandleQuery;
	handleMutation: TIPCMainHandleMutation;
	send: TIPCMainSend;
	subscribe: TIPCMainSubscribe;
};

const tipcMain = createTIPCMain();

const tipcMethod = tipcMain.method;
const tipc;
