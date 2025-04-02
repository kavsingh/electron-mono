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
