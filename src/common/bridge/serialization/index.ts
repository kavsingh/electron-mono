import { isSerializedBigInt, serializeBigInt } from "./bigint";
import {
  isSerializedBridgeError,
  serializeError,
  BridgeError,
} from "./bridge-error";

import type { SerializedBigInt } from "./bigint";
import type { SerializedBridgeError } from "./bridge-error";

export const serializeBridgePayload: {
  <T>(value: T): SerializedBridgePayload<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} = (value: any): any => {
  if (value instanceof Error) return serializeError(value);

  if (typeof value === "bigint") return serializeBigInt(value);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  if (Array.isArray(value)) return value.map(serializeBridgePayload);

  if (typeof value === "object") {
    return Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      Object.entries(value).map(([key, val]) => [
        key,
        serializeBridgePayload(val),
      ])
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return value;
};

export const deserializeBridgePayload: {
  <T>(value: SerializedBridgePayload<T>): DeserializedBridgePayload<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} = (value: any): any => {
  if (isSerializedBridgeError(value)) return new BridgeError(value);

  if (isSerializedBigInt(value)) return BigInt(value.value);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  if (Array.isArray(value)) return value.map(deserializeBridgePayload);

  if (typeof value === "object") {
    return Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      Object.entries(value).map(([key, val]) => [
        key,
        deserializeBridgePayload(val),
      ])
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return value;
};

export type SerializedBridgePayload<T> = T extends Error
  ? SerializedBridgeError
  : T extends bigint
  ? SerializedBigInt
  : T extends Array<infer U>
  ? SerializedBridgePayload<U>[]
  : T extends Record<string, unknown>
  ? { [K in keyof T]: SerializedBridgePayload<T[K]> }
  : T;

export type DeserializedBridgePayload<T> = T extends Error
  ? BridgeError
  : T extends Array<infer U>
  ? DeserializedBridgePayload<U>[]
  : T extends Record<string, unknown>
  ? { [K in keyof T]: DeserializedBridgePayload<T[K]> }
  : T;
