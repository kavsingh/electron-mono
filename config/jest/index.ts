import path from "path";

import type { Config } from "@jest/types";

const baseConfig: Config.InitialProjectOptions = {
	moduleNameMapper: { "^~/(.*)": "<rootDir>/src/$1" },
	transform: { "^.+\\.(t|j)s$": ["@swc/jest", {}] },
};

const transformRenderer: Config.InitialProjectOptions["transform"] = {
	"^.+\\.(t|j)sx?$": [
		"@swc/jest",
		{
			jsc: {
				transform: {
					react: {
						runtime: "automatic",
						importSource: "@emotion/react",
					},
				},
			},
		},
	],
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
			transform: transformRenderer,
			displayName: "renderer",
			testMatch: ["<rootDir>/src/renderer/**/*.test.[jt]s?(x)"],
			testEnvironment: "jsdom",
			setupFilesAfterEnv: [
				path.join(__dirname, "jest.renderer.setup-after-env.ts"),
			],
		},
	],
};
