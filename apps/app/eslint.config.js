import vitest from "@vitest/eslint-plugin";
import { defineConfig } from "eslint/config";
import tailwindcss from "eslint-plugin-better-tailwindcss";
import { getDefaultCallees } from "eslint-plugin-better-tailwindcss/api/defaults";
import jestDom from "eslint-plugin-jest-dom";
import playwright from "eslint-plugin-playwright";
import react from "eslint-plugin-react";
// eslint-disable-next-line import-x/default
import reactHooks from "eslint-plugin-react-hooks";
import testingLibrary from "eslint-plugin-testing-library";
import globals from "globals";

import baseConfig from "../../eslint.config.js";
import { testFilePatterns } from "../../eslint.helpers.js";

import importsConfig from "./eslint.imports.js";

export default defineConfig(
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
		files: ["src/**/*.?(m|c)[tj]s?(x)"],
		rules: {
			"no-console": "error",
		},
	},

	{
		files: ["src/common/**/*.?(m|c)[tj]s?(x)"],
		languageOptions: { globals: {} },
	},

	{
		files: ["src/preload/**/*.?(m|c)[tj]s?(x)"],
		languageOptions: {
			globals: { ...globals.browser },
		},
	},

	{
		files: ["src/main/**/*.?(m|c)[tj]s?(x)"],
		languageOptions: {
			globals: { ...globals.node },
		},
	},

	{
		files: ["src/renderer/**/*.?(m|c)[tj]s?(x)"],
		languageOptions: {
			globals: { ...globals.browser },
		},
		settings: {
			"react": { version: "detect" },
			"better-tailwindcss": {
				entryPoint: "src/renderer/index.css",
				callees: [...getDefaultCallees(), "tj", "tm"],
			},
		},
		plugins: { "better-tailwindcss": tailwindcss },
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		extends: [
			// @ts-expect-error upstream types
			react.configs.flat.recommended,
			react.configs.flat["jsx-runtime"],
			// @ts-expect-error upstream types
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			reactHooks.configs["flat/recommended"],
		],
		rules: {
			"react/jsx-filename-extension": [
				"error",
				{ extensions: [".tsx", ".jsx"] },
			],
			"react/prop-types": "off",
			...tailwindcss.configs["recommended"]?.rules,
			"better-tailwindcss/enforce-consistent-line-wrapping": "off",
			"better-tailwindcss/enforce-shorthand-classes": "warn",
			"better-tailwindcss/no-conflicting-classes": "error",
		},
	},

	{
		files: testFilePatterns(),
		languageOptions: {
			globals: { ...globals.node },
		},
	},

	{
		files: testFilePatterns({ root: "src" }),
		languageOptions: {
			globals: { ...globals.node },
		},
		settings: {
			vitest: { typecheck: true },
		},
		extends: [
			// @ts-expect-error upstream types
			vitest.configs.all,
		],
		rules: {
			"vitest/no-hooks": "off",
			"vitest/require-mock-type-parameters": "off",
		},
	},

	{
		files: testFilePatterns({ root: "src/renderer" }),
		languageOptions: {
			globals: { ...globals.node, ...globals.browser },
		},
		extends: [
			testingLibrary.configs["flat/react"],
			jestDom.configs["flat/recommended"],
		],
	},

	{
		files: testFilePatterns({ root: "e2e" }),
		extends: [playwright.configs["flat/recommended"]],
	},
);
