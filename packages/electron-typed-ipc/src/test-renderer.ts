import { TIPC_GLOBAL_NAMESPACE } from "./common";

import type { TIPCDefinitions, TIPCOperation } from "./common";
import type { TIPCResult } from "./internal";
import type { TIPCApi } from "./preload";
import type { IpcRenderer, IpcRendererEvent } from "electron";

const fnMocks: Record<string, (...args: unknown[]) => unknown> = {};
const eventHandlers: Record<
	string,
	Set<(event: IpcRendererEvent, payload: unknown) => void>
> = {};

async function mockInvoke(
	channel: string,
	payload: unknown,
): Promise<TIPCResult> {
	const mock = fnMocks[channel];

	if (typeof mock !== "function") {
		throw new Error(`no mock for ${channel}`);
	}

	try {
		return { __r: "ok", data: await mock(payload) };
	} catch (reason) {
		return { __r: "error", error: reason };
	}
}

function mockSend(channel: string, payload: unknown) {
	const mock = fnMocks[channel];

	if (typeof mock !== "function") {
		throw new Error(`no mock for ${channel}`);
	}

	mock(payload);
}

export function getTipcRendererMocks() {
	return { fnMocks, eventHandlers } as const;
}

export function mockTipcRenderer<TDefs extends TIPCDefinitions>(
	mocks: TIPCMockRenderer<TDefs>,
) {
	const api: TIPCApi = {
		invokeQuery: mockInvoke,
		invokeMutation: mockInvoke,
		send: mockSend,
		sendToHost: mockSend,
		subscribe: (
			channel: string,
			handler: (event: IpcRendererEvent, payload: unknown) => void,
		) => {
			if (eventHandlers[channel]) eventHandlers[channel].add(handler);
			else eventHandlers[channel] = new Set([handler]);

			return function unsubscribe() {
				if (eventHandlers[channel]) eventHandlers[channel].delete(handler);
			};
		},
	};

	applyTipcMocks(mocks);

	return { api, namespace: TIPC_GLOBAL_NAMESPACE };
}

export function applyTipcMocks<TDefs extends TIPCDefinitions>(
	mocks: Partial<TIPCMockRenderer<TDefs>>,
) {
	for (const [channel, fn] of Object.entries(mocks)) {
		if (typeof fn !== "function") {
			throw new Error(
				`exepcted mock for ${channel} to be a function, got ${typeof fn}`,
			);
		}

		// @ts-expect-error look man i'm on a late night train leave me alone
		fnMocks[channel] = fn;
	}
}

export function emitTipcMainEvent<
	TDefs extends TIPCDefinitions,
	TChannel extends string = EmitableChannel<TDefs>,
>(
	channel: TChannel,
	payload: TDefs[TChannel] extends { operation: "sendMain" }
		? keyof TDefs[TChannel]["payload"] extends never
			? // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
				void | undefined
			: TDefs[TChannel]["payload"]
		: never,
	event?: IpcRendererEvent,
) {
	eventHandlers[channel]?.forEach((handler) => {
		handler(event ?? createMockIpcRendererEvent(), payload);
	});
}

const mockIpcRendererEventDefaults: IpcRendererEvent = {
	ports: [],
	sender: {} as IpcRenderer,
	preventDefault: () => undefined,
	defaultPrevented: false,
};

export function createMockIpcRendererEvent(
	transform?: (defaults: IpcRendererEvent) => IpcRendererEvent,
) {
	return transform
		? transform({ ...mockIpcRendererEventDefaults })
		: { ...mockIpcRendererEventDefaults };
}

export type TIPCMockRenderer<
	TDefs extends TIPCDefinitions,
	TMockableKey extends keyof TDefs = MockableChannel<TDefs>,
> = {
	[TKey in TMockableKey]: TDefs[TKey] extends {
		operation: "invokeQuery" | "invokeMutation";
	}
		? (arg: TDefs[TKey]["arg"]) => Promise<Awaited<TDefs[TKey]["response"]>>
		: TDefs[TKey] extends { operation: "sendRenderer" }
			? (arg: TDefs[TKey]["payload"]) => void | Promise<void>
			: never;
};

type MockableChannel<TDefs extends TIPCDefinitions> = ChannelForOperation<
	TDefs,
	"invokeQuery" | "invokeMutation" | "sendRenderer"
>;

type EmitableChannel<TDefs extends TIPCDefinitions> = ChannelForOperation<
	TDefs,
	"sendMain"
>;

type ChannelForOperation<
	TDefs extends TIPCDefinitions,
	TOperation extends TIPCOperation["operation"],
> = string &
	Extract<
		{
			[TChannel in keyof TDefs]: {
				channel: TChannel;
				operation: TDefs[TChannel]["operation"];
			};
		}[keyof TDefs],
		{ operation: TOperation }
	>["channel"];
