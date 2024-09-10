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

import importsConfig from "./eslint.imports";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default tsEslintPlugin.config(
	{
		ignores: [
			"out/*",
			"dist/*",
			"coverage/*",
			"**/__generated__/*",
			"!**/__generated__/__mocks__/",
		],
	},

	...baseConfig,
	...importsConfig,

	{
		files: ["src/**/*.?([mc])[tj]s?(x)"],
		rules: {
			"no-console": "error",
		},
	},

	{
		files: ["src/common/**/*.?([mc])[tj]s?(x)"],
		languageOptions: { globals: {} },
	},

	{
		files: ["src/preload/**/*.?([mc])[tj]s?(x)"],
		languageOptions: {
			globals: { ...globals.browser },
		},
	},

	{
		files: ["src/main/**/*.?([mc])[tj]s?(x)"],
		languageOptions: {
			globals: { ...globals.node },
		},
	},

	{
		files: ["src/renderer/**/*.?([mc])[tj]s?(x)"],
		languageOptions: {
			globals: { ...globals.browser },
		},
		settings: {
			tailwindcss: {
				config: path.join(dirname, "tailwind.config.ts"),
				callees: ["tv", "classList"],
			},
		},
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		extends: [
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
			...tailwindPlugin.configs["flat/recommended"],
			solidPlugin.configs["flat/recommended"],
		],
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
		extends: [vitestPlugin.configs.all],
		rules: {
			"vitest/no-hooks": "off",
		},
	},

	{
		files: testFilePatterns({ root: "src/renderer" }),
		languageOptions: {
			globals: { ...globals.node, ...globals.browser },
		},
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		extends: [
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			testingPlugin.configs.recommended,
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			jestDomPlugin.configs["flat/recommended"],
		],
	},

	{
		files: testFilePatterns({ root: "e2e" }),
		extends: [playwrightPlugin.configs["flat/recommended"]],
	},
);
