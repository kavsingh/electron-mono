import { TIPC_GLOBAL_NAMESPACE } from "./common";

import type { TIPCDefinitions } from "./common";
import type { TIPCResult } from "./internal";
import type { TIPCApi } from "./preload";
import type { IpcRendererEvent } from "electron";

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

export type TIPCMockRenderer<
	TDefs extends TIPCDefinitions,
	TKeys extends keyof TDefs = MockableKeys<TDefs>,
> = {
	[TKey in TKeys]: TDefs[TKey] extends {
		operation: "invokeQuery" | "invokeMutation";
	}
		? (arg: TDefs[TKey]["arg"]) => Promise<Awaited<TDefs[TKey]["response"]>>
		: TDefs[TKey] extends { operation: "sendRenderer" }
			? (arg: TDefs[TKey]["payload"]) => void | Promise<void>
			: never;
};

type MockableKeys<TDefs extends TIPCDefinitions> = string &
	Extract<
		{ [K in keyof TDefs]: { key: K; op: TDefs[K]["operation"] } }[keyof TDefs],
		{ op: "invokeQuery" | "invokeMutation" | "sendRenderer" }
	>["key"];

type _EmitableKeys<TDefs extends TIPCDefinitions> = string &
	Extract<
		{ [K in keyof TDefs]: { key: K; op: TDefs[K]["operation"] } }[keyof TDefs],
		{ op: "sendMain" }
	>["key"];
