export const ELECTRON_TYPED_IPC_GLOBAL_NAMESPACE = "__ELECTRON_TYPED_IPC__";

export const defaultSerializer: Serializer = {
	serialize: (val) => val,
	deserialize: (val) => val,
};

export function createValueSerializer<TValue, TSerialized = unknown>(
	serializer: ValueSerializer<TValue, TSerialized>,
) {
	return serializer;
}

export function createSerializer(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	serializers: ValueSerializer<any, any>[],
): Serializer {
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

export type ElectronTypedIpcSchema = Readonly<Record<string, Operation>>;

export type Operation = Query | Mutation | SendFromMain | SendFromRenderer;

export type Query<TResponse = unknown, TArg = unknown> = {
	operation: "query";
	arg: TArg;
	response: TResponse;
};

export type Mutation<TResponse = unknown, TArg = unknown> = {
	operation: "mutation";
	arg: TArg;
	response: TResponse;
};

export type SendFromMain<TPayload = unknown> = {
	operation: "sendFromMain";
	payload: TPayload;
};

export type SendFromRenderer<TPayload = unknown> = {
	operation: "sendFromRenderer";
	payload: TPayload;
};

export type Serializer = {
	serialize: (val: unknown) => unknown;
	deserialize: (val: unknown) => unknown;
};

export type ValueSerializer<TValue, TSerialized> = {
	isDeserialized: (value: unknown) => value is TValue;
	isSerialized: (value: unknown) => value is TSerialized;
	serialize: (value: TValue) => TSerialized;
	deserialize: (value: TSerialized) => TValue;
};

export type Logger = {
	debug: (...args: unknown[]) => unknown;
	verbose: (...args: unknown[]) => unknown;
	info: (...args: unknown[]) => unknown;
	warn: (...args: unknown[]) => unknown;
	error: (...args: unknown[]) => unknown;
};

export type RemoveHandlerFn = () => void;

export type UnsubscribeFn = () => void;
