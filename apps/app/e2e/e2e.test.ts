import { test, expect } from "@playwright/test";

import { setupApplication, teardownApplication } from "./lib/application.ts";

import type { ElectronApplication } from "@playwright/test";

test.describe("e2e tests", () => {
	let app: ElectronApplication;

	test.beforeAll(async () => {
		app = await setupApplication();
	});

	test.afterAll(async () => {
		await teardownApplication(app);
	});

	test("should open at home page", async () => {
		const page = await app.firstWindow();

		await expect(
			page.getByRole("heading", { name: "System Info" }),
		).toBeVisible();
	});
});
