import { defaultSerializer, ELECTRON_TIPC_GLOBAL_NAMESPACE } from "./common";

import type { Logger, Serializer } from "./common";
import type { TIPCResult } from "./internal";
import type { AnyElectronTipcMainOperation } from "./main";
import type { ElectronTipcPreload } from "./preload";
import type { IpcRendererEvent } from "electron";

export function createElectronTipcRenderer<
	const TDefinitions extends Record<string, AnyElectronTipcMainOperation>,
>(options?: {
	serializer?: Serializer | undefined;
	logger?: Logger | undefined;
}) {
	const api =
		ELECTRON_TIPC_GLOBAL_NAMESPACE in globalThis.window
			? (globalThis.window[
					ELECTRON_TIPC_GLOBAL_NAMESPACE
				] as ElectronTipcPreload)
			: undefined;

	if (!api) {
		throw new Error(
			`tipc object named ${ELECTRON_TIPC_GLOBAL_NAMESPACE} not found on window`,
		);
	}

	const serializer = options?.serializer ?? defaultSerializer;
	const logger = options?.logger;
	const proxyObj = {};
	const proxyFn = () => undefined;
	let currentChannel = "__";

	const invokeProxy = new Proxy(proxyFn, {
		apply: async (_, __, [arg]: [unknown]) => {
			logger?.debug("invoke", { channel: currentChannel, arg });

			const response = (await api.invoke(
				currentChannel,
				arg ? serializer.serialize(arg) : undefined,
			)) as TIPCResult;

			logger?.debug("invoke result", { channel: currentChannel, response });

			if (response.__r === "error") {
				throw serializer.deserialize(response.error);
			}

			return serializer.deserialize(response.data);
		},
	});

	const sendProxy = new Proxy(proxyFn, {
		apply: (_, __, [payload]: [unknown]) => {
			logger?.debug("publish", { channel: currentChannel, payload });
			api.send(currentChannel, serializer.serialize(payload));
		},
	});

	const sendToHostProxy = new Proxy(proxyFn, {
		apply: (_, __, [payload]: [unknown]) => {
			logger?.debug("publish", { channel: currentChannel, payload });
			api.sendToHost(currentChannel, serializer.serialize(payload));
		},
	});

	const subscribeProxy = new Proxy(proxyFn, {
		apply: (__, ___, [handler]: [(...args: unknown[]) => unknown]) => {
			return api.subscribe(currentChannel, (event, payload) => {
				logger?.debug("subscribe receive", {
					channel: currentChannel,
					payload,
					handler,
				});

				void handler(event, serializer.deserialize(payload));
			});
		},
	});

	const operationsProxy = new Proxy(proxyObj, {
		get: (_, operation) => {
			if (typeof operation !== "string") return undefined;

			switch (operation) {
				case "invoke":
					return invokeProxy;

				case "send":
					return sendProxy;

				case "sendToHost":
					return sendToHostProxy;

				case "subscribe":
					return subscribeProxy;

				default:
					return undefined;
			}
		},
	});

	return new Proxy(proxyObj as ElectronTipcRenderer<TDefinitions>, {
		get: (_, channel) => {
			if (typeof channel !== "string") return undefined;

			currentChannel = channel;

			return operationsProxy;
		},
	});
}

export type ElectronTipcRenderer<
	TDefinitions extends Record<string, AnyElectronTipcMainOperation>,
> = {
	[TKey in keyof TDefinitions]: TDefinitions[TKey] extends {
		operation: "query";
	}
		? {
				query: (
					...args: keyof Parameters<
						TDefinitions[TKey]["handler"]
					>[1] extends never
						? []
						: [Parameters<TDefinitions[TKey]["handler"]>[1]]
				) => Extract<
					ReturnType<TDefinitions[TKey]["handler"]>,
					Promise<unknown>
				>;
			}
		: TDefinitions[TKey] extends { operation: "mutation" }
			? {
					mutate: (
						...args: keyof Parameters<
							TDefinitions[TKey]["handler"]
						>[1] extends never
							? []
							: [Parameters<TDefinitions[TKey]["handler"]>[1]]
					) => Extract<
						ReturnType<TDefinitions[TKey]["handler"]>,
						Promise<unknown>
					>;
				}
			: TDefinitions[TKey] extends { operation: "sendFromMain" }
				? {
						subscribe: (
							subscriber: (
								event: IpcRendererEvent,
								payload: Parameters<
									Parameters<TDefinitions[TKey]["sender"]>[0]["send"]
								>[0],
							) => void | Promise<void>,
						) => () => void;
					}
				: TDefinitions[TKey] extends { operation: "sendFromRenderer" }
					? {
							send: (
								payload: Parameters<TDefinitions[TKey]["subscriber"]>[1],
							) => void;
							sendToHost: (
								payload: Parameters<TDefinitions[TKey]["subscriber"]>[1],
							) => void;
						}
					: never;
};
