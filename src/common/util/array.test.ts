import { uniqueBy } from "./array";

describe("array util", () => {
  describe("uniqueBy", () => {
    it("should compact array by predicate", () => {
      expect(uniqueBy((a, b) => a === b, [1, 2, 3, 4, 3])).toEqual([
        1, 2, 3, 4,
      ]);
      expect(uniqueBy((a, b) => a === b, [true, false, false, true])).toEqual([
        true,
        false,
      ]);
    });

    it("should retain first element of unique checks", () => {
      expect(
        uniqueBy(
          (a, b) => a.a === b.a,
          [
            { a: 1, b: 2 },
            { a: 3, b: 4 },
            { a: 2, b: 4 },
            { a: 3, b: 5 },
          ]
        )
      ).toEqual([
        { a: 1, b: 2 },
        { a: 3, b: 4 },
        { a: 2, b: 4 },
      ]);
    });
  });
});
