import { createSerializer, createValueSerializer } from "electron-typed-ipc";

import CustomError, {
	serialize as serializeCustomError,
	deserialize as deserializeCustomError,
	isSerialized as isSerializedCustomError,
} from "#common/errors/custom-error";

const customErrorSerializer = createValueSerializer({
	isDeserialized: (val) => val instanceof CustomError,
	isSerialized: isSerializedCustomError,
	serialize: serializeCustomError,
	deserialize: deserializeCustomError,
});

export const serializer = createSerializer([customErrorSerializer]);
