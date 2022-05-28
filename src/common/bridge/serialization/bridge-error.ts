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

    this.name = name || this.name;
    this.stack = stack || this.stack;

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
  value: unknown
): value is SerializedBridgeError =>
  !!value && (value as SerializedBridgeError).__type === "BridgeError";

export interface SerializedBridgeError
  extends Pick<Error, "message" | "stack" | "name"> {
  __type: "BridgeError";
  // eslint-disable-next-line @typescript-eslint/member-ordering
  [key: string]: unknown;
}
