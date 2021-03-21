import type { Application } from "spectron";

import { startApplication, stopApplication } from "./util/application";
import { getText } from "./util/query";

describe("e2e tests", () => {
  let app: Application;

  beforeAll(async () => {
    app = await startApplication();
  });

  afterAll(async () => {
    await stopApplication(app);
  });

  it("should open at home page", async () => {
    const pageText = await getText(app.client.$("#app-root"));

    expect(pageText).toContain("Home");
  });
});
