import { ELECTRON_TYPED_IPC_GLOBAL_NAMESPACE } from "./internal";

import type { IpcResult, Definition, Schema, Operation } from "./internal";
import type { IpcPreloadApi } from "./preload";
import type { IpcRenderer, IpcRendererEvent } from "electron";

const fnMocks: Record<string, (...args: unknown[]) => unknown> = {};
const eventHandlers: Record<
	string,
	Set<(event: IpcRendererEvent, payload: unknown) => void>
> = {};

async function mockInvoke(
	channel: string,
	payload: unknown,
): Promise<IpcResult> {
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

export function mockTypedIpcRenderer<TSchema extends Schema<Definition>>(
	mocks: TypedIpcMockRenderer<TSchema>,
) {
	const api: IpcPreloadApi = {
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

export function applyTypedIpcMocks<TSchema extends Schema<Definition>>(
	mocks: Partial<TypedIpcMockRenderer<TSchema>>,
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
	TSchema extends Schema<Definition>,
	TChannel extends string = SendableChannel<TSchema>,
>(
	channel: TChannel,
	payload: TSchema[TChannel] extends { operation: "sendFromMain" }
		? keyof TSchema[TChannel]["payload"] extends never
			? undefined
			: TSchema[TChannel]["payload"]
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
	TSchema extends Schema<Definition>,
	TMockableKey extends keyof TSchema = MockableChannel<TSchema>,
> = {
	[TKey in TMockableKey]: TSchema[TKey] extends {
		operation: "query" | "mutation";
	}
		? (
				input: TSchema[TKey]["input"],
			) => Promise<Awaited<TSchema[TKey]["response"]>>
		: TSchema[TKey] extends { operation: "sendFromRenderer" }
			? (arg: TSchema[TKey]["payload"]) => void | Promise<void>
			: never;
};

type MockableChannel<TSchema extends Schema<Definition>> = ChannelForOperation<
	TSchema,
	"query" | "mutation" | "sendFromRenderer"
>;

type SendableChannel<TSchema extends Schema<Definition>> = ChannelForOperation<
	TSchema,
	"sendFromMain"
>;

type ChannelForOperation<
	TSchema extends Schema<Definition>,
	TOperation extends Operation["operation"],
> = string &
	Extract<
		{
			[TChannel in keyof TSchema]: {
				channel: TChannel;
				operation: TSchema[TChannel]["operation"];
			};
		}[keyof TSchema],
		{ operation: TOperation }
	>["channel"];
