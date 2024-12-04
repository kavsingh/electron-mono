import { createSerializer, createValueSerializer } from "tipc";

import CustomError, {
	serialize as serializeCustomError,
	deserialize as deserializeCustomError,
	isSerialized as isSerializedCustomError,
} from "#common/errors/custom-error";

const customErrorSerialzer = createValueSerializer({
	isDeserialized: (val) => val instanceof CustomError,
	isSerialized: isSerializedCustomError,
	serialize: serializeCustomError,
	deserialize: deserializeCustomError,
});

export const serializer = createSerializer([customErrorSerialzer]);
