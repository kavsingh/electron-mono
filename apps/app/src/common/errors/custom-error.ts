export const CUSTOM_ERROR_CODES = ["CODE_UNKNOWN", "CODE_A", "CODE_B"] as const;

export default class CustomError extends Error {
	override name = "CustomError";
	code: CustomErrorCode;

	constructor(code: CustomErrorCode, message: string) {
		super(message);

		this.code = code;
	}
}

export function isSerialized(value: unknown): value is SerializedCustomError {
	return (
		!!value &&
		typeof value === "object" &&
		"__serialized__" in value &&
		value.__serialized__ === "CustomError"
	);
}

export function serialize(inst: CustomError): SerializedCustomError {
	return {
		__serialized__: "CustomError",
		name: inst.name,
		message: inst.message,
		code: inst.code,
		stack: inst.stack,
		cause: inst.cause,
	};
}

export function deserialize(serialized: SerializedCustomError) {
	const error = new CustomError(serialized.code, serialized.message);

	if (serialized.stack) error.stack = serialized.stack;
	if (serialized.cause) error.cause = serialized.cause;

	return error;
}

export type SerializedCustomError = Omit<CustomError, "stack"> & {
	stack?: string | undefined;
	__serialized__: "CustomError";
};

export type CustomErrorCode = (typeof CUSTOM_ERROR_CODES)[number];
