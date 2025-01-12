export const ELECTRON_TYPED_IPC_GLOBAL_NAMESPACE = "__ELECTRON_TYPED_IPC__";

export const defaultSerializer: ElectronTypedIpcSerializer = {
	serialize: (val) => val,
	deserialize: (val) => val,
};

export function createValueSerializer<TValue, TSerialized = unknown>(
	serializer: ElectronTypedIpcValueSerializer<TValue, TSerialized>,
) {
	return serializer;
}

export function createSerializer<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends ElectronTypedIpcValueSerializer<any, any>,
>(serializers: T[]): ElectronTypedIpcSerializer {
	if (!serializers.length) return defaultSerializer;

	function serialize(value: unknown): unknown {
		for (const serializer of serializers) {
			if (serializer.isDeserialized(value)) {
				return serializer.serialize(value);
			}
		}

		if (!value) return value;

		if (Array.isArray(value)) {
			return value.map((val: unknown) => serialize(val));
		}

		if (value instanceof Error) return Error;

		if (typeof value === "object") {
			return Object.fromEntries(
				Object.entries(value).map(([key, val]) => [key, serialize(val)]),
			);
		}

		return value;
	}

	function deserialize(value: unknown): unknown {
		for (const serializer of serializers) {
			if (serializer.isSerialized(value)) {
				return serializer.deserialize(value);
			}
		}

		if (!value) return value;

		if (Array.isArray(value)) {
			return value.map((val: unknown) => deserialize(val));
		}

		if (value instanceof Error) return Error;

		if (typeof value === "object") {
			return Object.fromEntries(
				Object.entries(value).map(([key, val]) => [key, deserialize(val)]),
			);
		}

		return value;
	}

	return { serialize, deserialize };
}

export type DefineElectronTypedIpcSchema<
	TDefinitions extends ElectronTypedIpcSchema,
> = TDefinitions;

export type ElectronTypedIpcQuery<TResponse = unknown, TArg = unknown> = {
	operation: "query";
	arg: TArg;
	response: TResponse;
};

export type ElectronTypedIpcMutation<TResponse = unknown, TArg = unknown> = {
	operation: "mutation";
	arg: TArg;
	response: TResponse;
};

export type ElectronTypedIpcSendFromMain<TPayload = unknown> = {
	operation: "sendFromMain";
	payload: TPayload;
};

export type ElectronTypedIpcSendFromRenderer<TPayload = unknown> = {
	operation: "sendFromRenderer";
	payload: TPayload;
};

export type ElectronTypedIpcSchema = Readonly<
	Record<string, ElectronTypedIpcOperation>
>;

export type ElectronTypedIpcSerializer = {
	serialize: (val: unknown) => unknown;
	deserialize: (val: unknown) => unknown;
};

export type ElectronTypedIpcValueSerializer<TValue, TSerialized> = {
	isDeserialized: (value: unknown) => value is TValue;
	isSerialized: (value: unknown) => value is TSerialized;
	serialize: (value: TValue) => TSerialized;
	deserialize: (value: TSerialized) => TValue;
};

export type ElectronTypedIpcLogger = {
	debug: (...args: unknown[]) => unknown;
	verbose: (...args: unknown[]) => unknown;
	info: (...args: unknown[]) => unknown;
	warn: (...args: unknown[]) => unknown;
	error: (...args: unknown[]) => unknown;
};

export type ElectronTypedIpcOperation =
	| ElectronTypedIpcQuery
	| ElectronTypedIpcMutation
	| ElectronTypedIpcSendFromMain
	| ElectronTypedIpcSendFromRenderer;

export type ElectronTypedIpcRemoveHandlerFn = () => void;

export type ElectronTypedIpcUnsubscribeFn = () => void;
