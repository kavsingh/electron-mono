import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./test",
  testMatch: /\.test\.ts$/,
  workers: 1,
  outputDir: "./test/results",
  use: { screenshot: "only-on-failure" },
};

export default config;
