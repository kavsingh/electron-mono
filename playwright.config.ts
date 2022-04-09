import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./e2e",
  testMatch: /\.test\.ts$/,
  workers: 1,
  outputDir: "./e2e/results",
  use: { screenshot: "only-on-failure" },
};

export default config;
