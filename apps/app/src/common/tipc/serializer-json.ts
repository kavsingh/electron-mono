import { SuperJSON } from "superjson";

import CustomError, {
	serialize as serializeCustomError,
	deserialize as deserializeCustomError,
	isSerialized as isSerializedCustomError,
} from "#common/errors/custom-error";

import type { Serializer } from "tipc";

SuperJSON.registerCustom(
	{
		isApplicable: (value) => value instanceof CustomError,
		serialize: (value) => JSON.stringify(serializeCustomError(value)),
		deserialize: (value) => {
			const parsed: unknown = JSON.parse(value);

			return isSerializedCustomError(parsed)
				? deserializeCustomError(parsed)
				: new CustomError("CODE_UNKNOWN", "unknown");
		},
	},
	"CustomError",
);

function serialize(value: unknown) {
	return value ? SuperJSON.stringify(value) : value;
}

function deserialize(value: unknown) {
	return typeof value === "string" ? SuperJSON.parse(value) : value;
}

export const serializer: Serializer = { serialize, deserialize };
