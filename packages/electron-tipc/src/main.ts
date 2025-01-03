import type {
	BrowserWindow,
	IpcMain,
	IpcMainEvent,
	IpcMainInvokeEvent,
} from "electron";

export function createElectronTipcMain(_ipcMain: IpcMain) {
	const tipcMain = {
		queryHandler: <TReturn, TArg>(
			handler: ElectronTipcMainQueryHandler<TReturn, TArg>,
		): ElectronTipcMainQuery<TReturn, TArg> => {
			return { handler, operation: "query" };
		},

		mutationHandler: <TReturn, TArg>(
			handler: ElectronTipcMainMutationHandler<TReturn, TArg>,
		): ElectronTipcMainMutation<TReturn, TArg> => {
			return { handler, operation: "mutation" };
		},

		sender: <TPayload>(
			sender: ElectronTipcMainSenderFn<TPayload>,
		): ElectronTipcMainSender<TPayload> => {
			return { sender, operation: "sendFromMain" };
		},

		subscriber: <TPayload>(
			subscriber: ElectronTipcMainSubscriberFn<TPayload>,
		): ElectronTipcMainSubscriber<TPayload> => {
			return { subscriber, operation: "sendFromRenderer" };
		},
	};

	function createRouter<
		const TRoutes extends Record<string, AnyElectronTipcMainOperation>,
	>(routes: TRoutes): typeof routes {
		return routes;
	}

	return { tipcMain, createRouter };
}

type ElectronTipcMainQueryHandler<TReturn = unknown, TArg = void> = (
	event: IpcMainInvokeEvent,
	arg: TArg,
) => TReturn | Promise<TReturn>;

type ElectronTipcMainMutationHandler<TReturn = unknown, TArg = void> = (
	event: IpcMainInvokeEvent,
	arg: TArg,
) => TReturn | Promise<TReturn>;

type ElectronTipcMainSenderFn<TPayload = unknown> = (api: {
	send: (payload: TPayload, windows?: BrowserWindow[]) => void;
	sendToFrame: (
		payload: TPayload,
		frames: number | number[],
		windows?: BrowserWindow[],
	) => void;
}) => () => void;

type ElectronTipcMainSubscriberFn<TPayload = unknown> = (
	event: IpcMainEvent,
	payload: TPayload,
) => void | Promise<void>;

export type ElectronTipcMainQuery<TResponse = unknown, TArg = unknown> = {
	operation: "query";
	handler: ElectronTipcMainQueryHandler<TResponse, TArg>;
};

export type ElectronTipcMainMutation<TResponse = unknown, TArg = unknown> = {
	operation: "mutation";
	handler: ElectronTipcMainQueryHandler<TResponse, TArg>;
};

export type ElectronTipcMainSender<TPayload = unknown> = {
	operation: "sendFromMain";
	sender: ElectronTipcMainSenderFn<TPayload>;
};

export type ElectronTipcMainSubscriber<TPayload = unknown> = {
	operation: "sendFromRenderer";
	subscriber: ElectronTipcMainSubscriberFn<TPayload>;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export type AnyElectronTipcMainOperation =
	| ElectronTipcMainQuery<any, any>
	| ElectronTipcMainMutation<any, any>
	| ElectronTipcMainSender<any>
	| ElectronTipcMainSubscriber<any>;
/* eslint-enable */
