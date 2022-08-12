import path from "path";

import type { Config } from "@jest/types";

const baseConfig: Config.InitialProjectOptions = {
	moduleNameMapper: { "^~/(.*)": "<rootDir>/src/$1" },
};

export const config: Config.InitialOptions = {
	projects: [
		{
			...baseConfig,
			displayName: "common",
			testMatch: ["<rootDir>/src/common/**/*.test.[jt]s"],
			testEnvironment: "node",
		},
		{
			...baseConfig,
			displayName: "main",
			testMatch: [
				"<rootDir>/src/*.test.[jt]s",
				"<rootDir>/src/main/**/*.test.[jt]s",
				"<rootDir>/src/bridge/**/*.test.[jt]s",
			],
			testEnvironment: "node",
		},
		{
			...baseConfig,
			displayName: "renderer",
			testMatch: ["<rootDir>/src/renderer/**/*.test.[jt]s?(x)"],
			testEnvironment: "jsdom",
			setupFilesAfterEnv: [
				path.join(__dirname, "jest.renderer.setup-after-env.ts"),
			],
		},
	],
};
