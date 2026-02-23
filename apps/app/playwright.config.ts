import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
	testDir: "./e2e",
	testMatch: /\.test\.ts$/,
	workers: 1,
	outputDir: "./reports/e2e",
	use: { screenshot: "only-on-failure" },
};

export default config;
