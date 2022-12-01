import * as systeminformation from "systeminformation";
import { describe, it, expect, vi } from "vitest";

import { getSystemInfo } from "./system-info";

vi.mock("systeminformation");

describe("system-info", () => {
	describe("getSystemInfo", () => {
		it("should provide system info", async () => {
			// @ts-expect-error sparse mock
			vi.spyOn(systeminformation, "osInfo").mockResolvedValueOnce({
				codename: "OS Code",
			});
			// @ts-expect-error sparse mock
			vi.spyOn(systeminformation, "mem").mockResolvedValueOnce({
				total: 100,
				free: 50,
			});

			await expect(getSystemInfo()).resolves.toEqual({
				os: "OS Code",
				totalMemory: BigInt(100),
				freeMemory: BigInt(50),
			});
		});
	});
});
