import { defaultSerializer, TIPC_GLOBAL_NAMESPACE } from "./common";

import type { Serializer, TIPCDefinitions, TIPCRenderer } from "./common";

export function createTIPCRenderer<
	TDefinitions extends TIPCDefinitions,
>(options?: { serializer?: Serializer | undefined }) {
	const serializer = options?.serializer ?? defaultSerializer;
	const api = globalThis.window[TIPC_GLOBAL_NAMESPACE];

	const invokeProxy = new Proxy(
		{},
		{
			get: (_, channel) => {
				return new Proxy(() => undefined, {
					apply: async (__, ___, [arg]) => {
						const result = await api.invoke(
							channel as string,
							arg ? serializer.serialize(arg) : undefined,
						);

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
					apply: (__, ___, [arg]) => {
						api.send(channel as string, serializer.serialize(arg));
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
