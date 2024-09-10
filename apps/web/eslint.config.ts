import path from "node:path";
import { fileURLToPath } from "node:url";

// @ts-expect-error no types available
import jestDomPlugin from "eslint-plugin-jest-dom";
import playwrightPlugin from "eslint-plugin-playwright";
import solidPlugin from "eslint-plugin-solid";
// @ts-expect-error no types available
import tailwindPlugin from "eslint-plugin-tailwindcss";
// @ts-expect-error no types available
import testingPlugin from "eslint-plugin-testing-library";
import vitestPlugin from "eslint-plugin-vitest";
import globals from "globals";
import * as tsEslintPlugin from "typescript-eslint";

import baseConfig from "../../eslint.config";
import { testFilePatterns } from "../../eslint.helpers";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default tsEslintPlugin.config(
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
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		extends: [
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
			...tailwindPlugin.configs["flat/recommended"],
			solidPlugin.configs["flat/recommended"],
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
		files: testFilePatterns(),
		languageOptions: {
			globals: { ...globals.node },
		},
	},

	{
		files: [testFilePatterns({ root: "src" })],
		languageOptions: {
			globals: { ...globals.node },
		},
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		extends: [
			vitestPlugin.configs.all,
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			testingPlugin.configs.recommended,
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			jestDomPlugin.configs["flat/recommended"],
		],
		rules: {
			"vitest/no-hooks": "off",
		},
	},

	{
		files: testFilePatterns({ root: "e2e" }),
		extends: [playwrightPlugin.configs["flat/recommended"]],
	},
);
