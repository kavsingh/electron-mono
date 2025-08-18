import * as systeminformation from "systeminformation";
import { describe, it, expect, vi } from "vitest";

import { getSystemStats } from "./system-stats";

vi.mock("systeminformation");

describe("system-stats", () => {
	describe(getSystemStats, () => {
		it("should provide system stats", async () => {
			expect.assertions(1);

			// @ts-expect-error sparse mock
			vi.spyOn(systeminformation, "mem").mockResolvedValueOnce({
				total: 100,
				available: 40,
				active: 60,
			});

			await expect(getSystemStats()).resolves.toStrictEqual({
				memTotal: "100",
				memAvailable: "40",
				memUsed: "60",
				sampledAt: expect.any(String),
			});
		});
	});
});
