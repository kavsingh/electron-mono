import CustomError, {
	serialize as serializeCustomError,
	deserialize as deserializeCustomError,
	isSerialized as isSerializedCustomError,
} from "#common/errors/custom-error";

import type { Serializer } from "tipc";

function serialize(value: unknown): unknown {
	if (!value) return value;

	if (value instanceof CustomError) return serializeCustomError(value);

	if (value instanceof Error) return Error;

	if (Array.isArray(value)) return value.map((val: unknown) => serialize(val));

	if (typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value).map(([key, val]) => [key, serialize(val)]),
		);
	}

	return value;
}

function deserialize(value: unknown): unknown {
	if (!value) return value;

	if (isSerializedCustomError(value)) return deserializeCustomError(value);

	if (Array.isArray(value)) {
		return value.map((val: unknown) => deserialize(val));
	}

	if (typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value).map(([key, val]) => [key, deserialize(val)]),
		);
	}

	return value;
}

export const serializer = { serialize, deserialize } as Serializer;
