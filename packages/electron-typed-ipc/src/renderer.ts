import { ELECTRON_TYPED_IPC_GLOBAL_NAMESPACE, exhaustive } from "./internal";
import { defaultSerializer } from "./serializer";

import type {
	AnySchema,
	IpcResult,
	KeysOfUnion,
	UnsubscribeFn,
	Schema,
	Query,
	Mutation,
	SendFromRenderer,
	SendFromMain,
	Definition,
	OperationWithChannel,
} from "./internal";
import type { Logger } from "./logger";
import type { IpcPreloadApi } from "./preload";
import type { Serializer } from "./serializer";
import type { IpcRendererEvent } from "electron";

export function createElectronTypedIpcRenderer<
	TSchema extends Schema<Definition>,
>(options?: {
	serializer?: Serializer | undefined;
	logger?: Logger | undefined;
}) {
	const preloadApi =
		ELECTRON_TYPED_IPC_GLOBAL_NAMESPACE in globalThis.window
			? (globalThis.window[
					ELECTRON_TYPED_IPC_GLOBAL_NAMESPACE
				] as IpcPreloadApi)
			: undefined;

	if (!preloadApi) {
		throw new Error(
			`object named ${ELECTRON_TYPED_IPC_GLOBAL_NAMESPACE} not found on window`,
		);
	}

	const serializer = options?.serializer ?? defaultSerializer;
	const logger = options?.logger;
	const proxyObj = {};
	const proxyFn = () => undefined;

	function queryProxy(api: IpcPreloadApi, channel: string) {
		return new Proxy(proxyFn, {
			apply: async (_, __, [arg]: [unknown]) => {
				logger?.debug("query", { channel, arg });

				const response = (await api.query(
					channel,
					arg ? serializer.serialize(arg) : undefined,
				)) as IpcResult;

				logger?.debug("query result", {
					channel,
					response,
				});

				if (response.__r === "error") {
					throw serializer.deserialize(response.error);
				}

				return serializer.deserialize(response.data);
			},
		});
	}

	function mutationProxy(api: IpcPreloadApi, channel: string) {
		return new Proxy(proxyFn, {
			apply: async (_, __, [arg]: [unknown]) => {
				logger?.debug("mutation", { channel, arg });

				const response = (await api.mutate(
					channel,
					arg ? serializer.serialize(arg) : undefined,
				)) as IpcResult;

				logger?.debug("mutation result", { channel, response });

				if (response.__r === "error") {
					throw serializer.deserialize(response.error);
				}

				return serializer.deserialize(response.data);
			},
		});
	}

	function sendProxy(api: IpcPreloadApi, channel: string) {
		return new Proxy(proxyFn, {
			apply: (
				_,
				__,
				[payload, sendOptions]: [unknown, SendFromRendererOptions | undefined],
			) => {
				const serialized = serializer.serialize(payload);

				logger?.debug("send", {
					channel,
					payload: serialized,
					sendOptions,
				});

				if (sendOptions?.toHost) api.sendToHost(channel, serialized);
				else api.send(channel, serialized);
			},
		});
	}

	function subscribeProxy(api: IpcPreloadApi, channel: string) {
		return new Proxy(proxyFn, {
			apply: (__, ___, [handler]: [(...args: unknown[]) => unknown]) => {
				return api.subscribe(channel, (event, payload) => {
					logger?.debug("subscribe receive", {
						channel,
						payload,
						handler,
					});

					void handler(event, serializer.deserialize(payload));
				});
			},
		});
	}

	function operationsProxy(api: IpcPreloadApi, channel: string) {
		return new Proxy(proxyObj, {
			get: (_, operation) => {
				if (typeof operation !== "string") return undefined;

				const op = operation as RendererProxyMethod;

				switch (op) {
					case "query":
						return queryProxy(api, channel);

					case "mutate":
						return mutationProxy(api, channel);

					case "send":
						return sendProxy(api, channel);

					case "subscribe":
						return subscribeProxy(api, channel);

					default: {
						exhaustive(op, logger);

						return undefined;
					}
				}
			},
		});
	}

	return new Proxy(proxyObj as ElectronTypedIpcRenderer<TSchema>, {
		get: (_, channel) => {
			if (typeof channel !== "string") return undefined;

			return operationsProxy(preloadApi, channel);
		},
	});
}

type ElectronTypedIpcRenderer<TDefinitions extends Schema<Definition>> =
	Readonly<{
		[TName in keyof TDefinitions]: TDefinitions[TName] extends OperationWithChannel<Query>
			? {
					query: (
						...args: TDefinitions[TName]["input"] extends undefined
							? []
							: [input: TDefinitions[TName]["input"]]
					) => Promise<TDefinitions[TName]["response"]>;
				}
			: TDefinitions[TName] extends OperationWithChannel<Mutation>
				? {
						mutate: (
							...args: TDefinitions[TName]["input"] extends undefined
								? []
								: [input: TDefinitions[TName]["input"]]
						) => Promise<TDefinitions[TName]["response"]>;
					}
				: TDefinitions[TName] extends OperationWithChannel<SendFromRenderer>
					? {
							send: (
								...args: TDefinitions[TName]["payload"] extends undefined
									? [options?: SendFromRendererOptions]
									: [
											payload: TDefinitions[TName]["payload"],
											options?: SendFromRendererOptions,
										]
							) => void;
						}
					: TDefinitions[TName] extends OperationWithChannel<SendFromMain>
						? {
								subscribe: (
									listener: (
										...args: TDefinitions[TName]["payload"] extends undefined
											? [event: IpcRendererEvent]
											: [
													event: IpcRendererEvent,
													payload: TDefinitions[TName]["payload"],
												]
									) => void | Promise<void>,
								) => UnsubscribeFn;
							}
						: never;
	}>;

export type SendFromRendererOptions = {
	toHost?: boolean | undefined;
};

type RendererProxyMethod = KeysOfUnion<
	ElectronTypedIpcRenderer<AnySchema>[keyof ElectronTypedIpcRenderer<AnySchema>]
>;
