import { ELECTRON_TYPED_IPC_GLOBAL_NAMESPACE } from "./internal";

import type { IpcPreloadResult } from "./internal";
import type { TypedIpcPreload } from "./preload";
import type { ElectronTypedIpcSchema, Operation } from "./schema";
import type { IpcRenderer, IpcRendererEvent } from "electron";

const fnMocks: Record<string, (...args: unknown[]) => unknown> = {};
const eventHandlers: Record<
	string,
	Set<(event: IpcRendererEvent, payload: unknown) => void>
> = {};

async function mockInvoke(
	channel: string,
	payload: unknown,
): Promise<IpcPreloadResult> {
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

export function getTypedIpcRendererMocks() {
	return { fnMocks, eventHandlers } as const;
}

export function mockTypedIpcRenderer<TDefs extends ElectronTypedIpcSchema>(
	mocks: TypedIpcMockRenderer<TDefs>,
) {
	const api: TypedIpcPreload = {
		query: mockInvoke,
		mutate: mockInvoke,
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

	applyTypedIpcMocks(mocks);

	return { api, namespace: ELECTRON_TYPED_IPC_GLOBAL_NAMESPACE };
}

export function applyTypedIpcMocks<TDefs extends ElectronTypedIpcSchema>(
	mocks: Partial<TypedIpcMockRenderer<TDefs>>,
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

export function typedIpcSendFromMain<
	TDefs extends ElectronTypedIpcSchema,
	TChannel extends string = SendableChannel<TDefs>,
>(
	channel: TChannel,
	payload: TDefs[TChannel] extends { operation: "sendFromMain" }
		? keyof TDefs[TChannel]["payload"] extends never
			? undefined
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

export type TypedIpcMockRenderer<
	TDefs extends ElectronTypedIpcSchema,
	TMockableKey extends keyof TDefs = MockableChannel<TDefs>,
> = {
	[TKey in TMockableKey]: TDefs[TKey] extends {
		operation: "query" | "mutation";
	}
		? (arg: TDefs[TKey]["arg"]) => Promise<Awaited<TDefs[TKey]["response"]>>
		: TDefs[TKey] extends { operation: "sendFromRenderer" }
			? (arg: TDefs[TKey]["payload"]) => void | Promise<void>
			: never;
};

type MockableChannel<TDefs extends ElectronTypedIpcSchema> =
	ChannelForOperation<TDefs, "query" | "mutation" | "sendFromRenderer">;

type SendableChannel<TDefs extends ElectronTypedIpcSchema> =
	ChannelForOperation<TDefs, "sendFromMain">;

type ChannelForOperation<
	TDefs extends ElectronTypedIpcSchema,
	TOperation extends Operation["operation"],
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
