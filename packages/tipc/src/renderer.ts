import { defaultSerializer, TIPC_GLOBAL_NAMESPACE } from "./common";

import type {
	Logger,
	Serializer,
	TIPCDefinitions,
	TIPCRenderer,
} from "./common";

export function createTIPCRenderer<
	TDefinitions extends TIPCDefinitions,
>(options?: {
	serializer?: Serializer | undefined;
	logger?: Logger | undefined;
}) {
	const api = globalThis.window[TIPC_GLOBAL_NAMESPACE];
	const serializer = options?.serializer ?? defaultSerializer;
	const logger = options?.logger;

	const invokeProxy = new Proxy(
		{},
		{
			get: (_, channel) => {
				return new Proxy(() => undefined, {
					apply: async (__, ___, [arg]: [unknown]) => {
						logger?.debug("invoke", { channel, arg });

						const result = (await api.invoke(
							channel as string,
							arg ? serializer.serialize(arg) : undefined,
						)) as unknown;

						logger?.debug("invoke result", { channel, result });

						return serializer.deserialize(result);
					},
				});
			},
		},
	);

	const publishProxy = new Proxy(
		{},
		{
			get: (_, channel) => {
				return new Proxy(() => undefined, {
					apply: (__, ___, [payload]: [unknown]) => {
						logger?.debug("publish", { channel, payload });
						api.send(channel as string, serializer.serialize(payload));
					},
				});
			},
		},
	);

	const subscribeProxy = new Proxy(
		{},
		{
			get: (_, channel) => {
				return new Proxy(() => undefined, {
					apply: (__, ___, [handler]: [(...args: unknown[]) => unknown]) => {
						return api.subscribe(channel as string, (event, payload) => {
							logger?.debug("subscribe receive", { channel, payload, handler });

							void handler(event, serializer.deserialize(payload));
						});
					},
				});
			},
		},
	);

	return new Proxy({} as unknown as TIPCRenderer<TDefinitions>, {
		get: (_, operation) => {
			switch (operation as keyof TIPCRenderer<TDefinitions>) {
				case "invoke":
					return invokeProxy;

				case "publish":
					return publishProxy;

				case "subscribe":
					return subscribeProxy;

				default:
					return undefined;
			}
		},
	});
}
