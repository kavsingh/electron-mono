import * as systeminformation from "systeminformation";
import { describe, it, expect, vi } from "vitest";

import { getSystemInfo } from "./system-info";

vi.mock("systeminformation");

describe("system-info", () => {
	describe(getSystemInfo, () => {
		it("should provide system info", async () => {
			expect.assertions(1);

			// @ts-expect-error sparse mock
			vi.spyOn(systeminformation, "osInfo").mockResolvedValueOnce({
				codename: "OS Code",
				release: "1.0.0",
				arch: "arch",
			});

			await expect(getSystemInfo()).resolves.toStrictEqual({
				osName: "OS Code",
				osVersion: "1.0.0",
				osArch: "arch",
			});
		});
	});
});
