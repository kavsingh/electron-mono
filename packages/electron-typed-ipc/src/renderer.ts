import {
	defaultSerializer,
	ELECTRON_TYPED_IPC_GLOBAL_NAMESPACE,
} from "./common";
import { exhaustive } from "./internal";

import type {
	Logger,
	Serializer,
	ElectronTypedIpcSchema,
	Query,
	Mutation,
	SendFromRenderer,
	SendFromMain,
	UnsubscribeFn,
} from "./common";
import type { AnySchema, IpcPreloadResult, KeysOfUnion } from "./internal";
import type { TypedIpcPreload } from "./preload";
import type { IpcRendererEvent } from "electron";

export function createElectronTypedIpcRenderer<
	TDefinitions extends ElectronTypedIpcSchema,
>(options?: {
	serializer?: Serializer | undefined;
	logger?: Logger | undefined;
}) {
	const api =
		ELECTRON_TYPED_IPC_GLOBAL_NAMESPACE in globalThis.window
			? (globalThis.window[
					ELECTRON_TYPED_IPC_GLOBAL_NAMESPACE
				] as TypedIpcPreload)
			: undefined;

	if (!api) {
		throw new Error(
			`object named ${ELECTRON_TYPED_IPC_GLOBAL_NAMESPACE} not found on window`,
		);
	}

	const serializer = options?.serializer ?? defaultSerializer;
	const logger = options?.logger;
	const proxyObj = {};
	const proxyFn = () => undefined;
	let currentChannel = "__";

	const queryProxy = new Proxy(proxyFn, {
		apply: async (_, __, [arg]: [unknown]) => {
			logger?.debug("query", { channel: currentChannel, arg });

			const response = (await api.query(
				currentChannel,
				arg ? serializer.serialize(arg) : undefined,
			)) as IpcPreloadResult;

			logger?.debug("query result", {
				channel: currentChannel,
				response,
			});

			if (response.__r === "error") {
				throw serializer.deserialize(response.error);
			}

			return serializer.deserialize(response.data);
		},
	});

	const mutationProxy = new Proxy(proxyFn, {
		apply: async (_, __, [arg]: [unknown]) => {
			logger?.debug("mutation", { channel: currentChannel, arg });

			const response = (await api.mutate(
				currentChannel,
				arg ? serializer.serialize(arg) : undefined,
			)) as IpcPreloadResult;

			logger?.debug("mutation result", {
				channel: currentChannel,
				response,
			});

			if (response.__r === "error") {
				throw serializer.deserialize(response.error);
			}

			return serializer.deserialize(response.data);
		},
	});

	const sendProxy = new Proxy(proxyFn, {
		apply: (
			_,
			__,
			[payload, sendOptions]: [
				unknown,
				ElectronTypedIpcSendFromRendererOptions | undefined,
			],
		) => {
			const serialized = serializer.serialize(payload);

			logger?.debug("send", {
				channel: currentChannel,
				payload: serialized,
				sendOptions,
			});

			if (sendOptions?.toHost) api.sendToHost(currentChannel, serialized);
			else api.send(currentChannel, serialized);
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

			const op = operation as RendererProxyMethod;

			switch (op) {
				case "query":
					return queryProxy;

				case "mutate":
					return mutationProxy;

				case "send":
					return sendProxy;

				case "subscribe":
					return subscribeProxy;

				default: {
					exhaustive(op, logger);

					return undefined;
				}
			}
		},
	});

	return new Proxy(proxyObj as ElectronTypedIpcRenderer<TDefinitions>, {
		get: (_, channel) => {
			if (typeof channel !== "string") return undefined;

			currentChannel = channel;

			return operationsProxy;
		},
	});
}

export type ElectronTypedIpcRenderer<
	TDefinitions extends ElectronTypedIpcSchema,
> = Readonly<{
	[TName in keyof TDefinitions]: TDefinitions[TName] extends Query
		? {
				query: (
					...args: keyof TDefinitions[TName]["arg"] extends never
						? []
						: [arg: TDefinitions[TName]["arg"]]
				) => Promise<TDefinitions[TName]["response"]>;
			}
		: TDefinitions[TName] extends Mutation
			? {
					mutate: (
						...args: keyof TDefinitions[TName]["arg"] extends never
							? []
							: [arg: TDefinitions[TName]["arg"]]
					) => Promise<TDefinitions[TName]["response"]>;
				}
			: TDefinitions[TName] extends SendFromRenderer
				? {
						send: (
							...args: keyof TDefinitions[TName]["payload"] extends never
								? [undefined, ElectronTypedIpcSendFromRendererOptions]
								: [
										TDefinitions[TName]["payload"],
										ElectronTypedIpcSendFromRendererOptions,
									]
						) => void;
					}
				: TDefinitions[TName] extends SendFromMain
					? {
							subscribe: (
								listener: (
									...args: keyof TDefinitions[TName]["payload"] extends never
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

export type ElectronTypedIpcSendFromRendererOptions = {
	toHost?: boolean | undefined;
};

type RendererProxyMethod = KeysOfUnion<
	ElectronTypedIpcRenderer<AnySchema>[keyof ElectronTypedIpcRenderer<AnySchema>]
>;
