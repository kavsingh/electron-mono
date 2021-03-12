import { resolve } from "path";

import { Application } from "spectron";

import { productName } from "../package.json";

const projectRoot = resolve(__dirname, "..");
const appPaths = {
  darwin: resolve(
    projectRoot,
    `out/${productName}-darwin-${process.arch}/${productName}.app/Contents/MacOS/${productName}`
  ),
};

const getText = (elementQuery: Promise<WebdriverIO.Element>) =>
  elementQuery.then((el) => el.getText());

describe("e2e tests", () => {
  let app: Application;

  beforeAll(async () => {
    app = new Application({
      path: appPaths[process.platform],
      env: { SPECTRON: true },
    });

    await app.start();
  });

  afterAll(async () => {
    if (app.isRunning()) await app.stop();
  });

  it("should open at home page", async () => {
    const pageText = await getText(app.client.$("#app-root"));

    expect(pageText).toContain("Home");
  });
});
