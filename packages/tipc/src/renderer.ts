import { defaultSerializer, TIPC_GLOBAL_NAMESPACE } from "./common";

import type {
	Logger,
	Serializer,
	TIPCDefinitions,
	TIPCRenderer,
} from "./common";
import type { TIPCResult } from "./internal";
import type { TIPCApi } from "./preload";

export function createTIPCRenderer<
	TDefinitions extends TIPCDefinitions,
>(options?: {
	serializer?: Serializer | undefined;
	logger?: Logger | undefined;
}) {
	const api =
		TIPC_GLOBAL_NAMESPACE in globalThis.window
			? (globalThis.window[TIPC_GLOBAL_NAMESPACE] as TIPCApi)
			: undefined;

	if (!api) {
		throw new Error(
			`tipc object named ${TIPC_GLOBAL_NAMESPACE} not found on window`,
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

	return new Proxy(proxyObj as TIPCRenderer<TDefinitions>, {
		get: (_, channel) => {
			if (typeof channel !== "string") return undefined;

			currentChannel = channel;

			return operationsProxy;
		},
	});
}
