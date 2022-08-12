export class BridgeError extends Error {
	[key: string]: unknown;

	constructor({
		__type,
		message,
		name,
		stack,
		...customProps
	}: SerializedBridgeError) {
		super(message);

		if (name) this.name = name;
		if (stack) this.stack = stack;

		Object.assign(this, customProps);
	}
}

export const serializeError = (error: Error): SerializedBridgeError => ({
	...error,
	__type: "BridgeError",
	message: error.message,
	stack: error.stack,
});

export const isSerializedBridgeError = (
	value: unknown,
): value is SerializedBridgeError =>
	!!value && (value as SerializedBridgeError).__type === "BridgeError";

export interface SerializedBridgeError {
	__type: "BridgeError";
	message: Error["message"] | undefined;
	stack: Error["stack"] | undefined;
	name: Error["name"] | undefined;

	// eslint-disable-next-line @typescript-eslint/member-ordering
	[key: string]: unknown;
}
