import {
	createSerializer,
	createValueSerializer,
} from "@kavsingh/electron-typed-ipc";

import CustomError, {
	serialize,
	deserialize,
	isSerialized,
} from "#common/errors/custom-error";

const customErrorSerializer = createValueSerializer({
	serialize,
	deserialize,
	isSerialized,
	isDeserialized: (val) => val instanceof CustomError,
});

export const serializer = createSerializer([customErrorSerializer]);
