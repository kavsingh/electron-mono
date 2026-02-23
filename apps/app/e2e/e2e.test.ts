import { test, expect } from "./fixtures.ts";

test.describe("e2e tests", () => {
	test("should open at home page", async ({ page }) => {
		await expect(
			page.getByRole("heading", { name: "System Info" }),
		).toBeVisible();
	});
});
