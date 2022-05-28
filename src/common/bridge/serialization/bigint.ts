export const serializeBigInt = (value: bigint): SerializedBigInt => ({
  __type: "bigint",
  value: value.toString(),
});

export const isSerializedBigInt = (value: unknown): value is SerializedBigInt =>
  !!value && (value as SerializedBigInt).__type === "bigint";

export type SerializedBigInt = {
  __type: "bigint";
  value: string;
};
