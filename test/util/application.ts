import { resolve, join } from "path";

import { Application } from "spectron";

import { productName } from "../../package.json";

const fromRoot = join.bind(null, resolve(__dirname, "../.."));

const appPaths: Partial<Record<NodeJS.Platform, string>> = {
  darwin: fromRoot(
    `out/${productName}-darwin-${process.arch}/${productName}.app/Contents/MacOS/${productName}`
  ),
};

export const startApplication = async (): Promise<Application> => {
  const app = new Application({
    path: appPaths[process.platform] ?? "",
    env: { SPECTRON: true },
  });

  await app.start();

  return app;
};

export const stopApplication = async (app: Application): Promise<void> => {
  if (app.isRunning()) await app.stop();
};
