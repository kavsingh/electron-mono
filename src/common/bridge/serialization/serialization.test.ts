import { BridgeError } from "./bridge-error";
import { serializeBridgePayload, deserializeBridgePayload } from "./index";

describe("serialization", () => {
  describe("serializeBridgePayload", () => {
    it("should recursively serialize a bridge payload", () => {
      expect(
        serializeBridgePayload({
          foo: [{ bar: BigInt("10000"), baz: { qux: 35 } }],
          bar: new Error("Bar"),
        })
      ).toEqual({
        foo: [{ bar: { __type: "bigint", value: "10000" }, baz: { qux: 35 } }],
        bar: expect.objectContaining({ __type: "BridgeError", message: "Bar" }),
      });
    });
  });

  describe("deserializeBridgePayload", () => {
    it("should recursively deserialize a bridge payload", () => {
      expect(
        deserializeBridgePayload({
          foo: [
            { bar: { __type: "bigint", value: "10000" }, baz: { qux: 35 } },
          ],
          bar: { __type: "BridgeError", name: "Bar" },
        })
      ).toEqual({
        foo: [{ bar: BigInt("10000"), baz: { qux: 35 } }],
        bar: expect.any(BridgeError),
      });
    });
  });
});
