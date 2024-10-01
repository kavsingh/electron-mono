import path from "node:path";
import { fileURLToPath } from "node:url";

import { fixupPluginRules } from "@eslint/compat";
// @ts-expect-error no types available
import jestDom from "eslint-plugin-jest-dom";
import playwright from "eslint-plugin-playwright";
import solid from "eslint-plugin-solid";
import tailwindcss from "eslint-plugin-tailwindcss";
// @ts-expect-error no types available
import testingLibrary from "eslint-plugin-testing-library";
import vitest from "eslint-plugin-vitest";
import globals from "globals";
import * as tsEslint from "typescript-eslint";

import baseConfig from "../../eslint.config";
import { testFilePatterns } from "../../eslint.helpers";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default tsEslint.config(
	{
		ignores: [
			"dist/*",
			"coverage/*",
			"**/__generated__/*",
			"!**/__generated__/__mocks__/",
		],
	},

	...baseConfig,

	{
		settings: {
			"import-x/resolver": {
				"eslint-import-resolver-typescript": {
					project: path.resolve(dirname, "./tsconfig.json"),
				},
			},
		},
	},

	{
		files: ["src/**/*.?([mc])[tj]s?(x)"],
		languageOptions: {
			globals: { ...globals.browser },
		},
		settings: {
			tailwindcss: {
				config: path.join(dirname, "tailwind.config.ts"),
				callees: ["twMerge", "twJoin"],
			},
		},
		extends: [
			...tailwindcss.configs["flat/recommended"],
			solid.configs["flat/recommended"],
		],
		rules: {
			"no-console": "error",
		},
	},

	{
		files: ["src/routes/**/*.?([mc])[tj]s?(x)"],
		rules: {
			"filenames/match-regex": [
				"error",
				"^(\\[)?[a-z0-9-.]+(\\])?$",
				{ ignoreExported: true },
			],
			"filenames/match-exported": "off",
		},
	},

	{
		files: [testFilePatterns({ root: "src" })],
		languageOptions: {
			globals: { ...globals.node },
		},
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		extends: [
			vitest.configs.all,
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			jestDom.configs["flat/recommended"],
		],
		plugins: {
			"testing-library": fixupPluginRules({
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
				rules: testingLibrary.rules,
			}),
		},
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		rules: {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			...testingLibrary.configs["flat/dom"].rules,
			"vitest/no-hooks": "off",
		},
	},

	{
		files: testFilePatterns({ root: "e2e" }),
		extends: [playwright.configs["flat/recommended"]],
	},
);
