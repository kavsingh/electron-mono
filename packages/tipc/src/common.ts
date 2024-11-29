export const TIPC_GLOBAL_NAMESPACE = "__TIPC_API__";

export type TIPCDefinitions<
	TInvoke extends Record<string, [unknown, unknown]> = Record<
		string,
		[unknown, unknown]
	>,
	TMainEvents extends Record<string, unknown> = Record<string, unknown>,
	TRendererEvents extends Record<string, unknown> = Record<string, unknown>,
> = {
	invoke: TInvoke;
	mainEvents: TMainEvents;
	rendererEvents: TRendererEvents;
};

export type Serializer = {
	serialize: <T>(val: T) => Serialized<T>;
	deserialize: <T>(val: Serialized<T>) => T;
};

export type Serialized<T> = T;
