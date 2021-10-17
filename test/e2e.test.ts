import { waitFor } from "@testing-library/react";
import { setupBrowser } from "@testing-library/webdriverio";

import { startApplication, stopApplication } from "./util/application";

import type { Application } from "spectron";

describe("e2e tests", () => {
  let app: Application;
  let clientQueries: ReturnType<typeof setupBrowser>;

  beforeAll(async () => {
    app = await startApplication();
    clientQueries = setupBrowser(app.client);
  });

  afterAll(async () => {
    await stopApplication(app);
  });

  it("should open at home page", async () => {
    const { getByText } = clientQueries;

    await waitFor(() => {
      expect(getByText("Home")).toBeInTheDocument();
    });
  });
});
