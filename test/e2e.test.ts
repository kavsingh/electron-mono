import { test } from "@playwright/test";

import { setupApplication, teardownApplication } from "./lib/application";

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

    await test.expect(page.locator("_react=h2 >> text=Home")).toBeVisible();
  });
});
