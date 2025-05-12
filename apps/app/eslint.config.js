import jestDom from "eslint-plugin-jest-dom";
import playwright from "eslint-plugin-playwright";
import react from "eslint-plugin-react";
import { configs as reactHooks } from "eslint-plugin-react-hooks";
import testingLibrary from "eslint-plugin-testing-library";
import vitest from "eslint-plugin-vitest";
import globals from "globals";
import * as tsEslint from "typescript-eslint";

import baseConfig from "../../eslint.config.js";
import { testFilePatterns } from "../../eslint.helpers.js";

import importsConfig from "./eslint.imports.js";

export default tsEslint.config(
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
			react: { version: "detect" },
		},
		extends: [
			reactHooks.recommended,
			// @ts-expect-error upstream types
			react.configs.flat.recommended,
			// @ts-expect-error upstream types
			react.configs.flat["jsx-runtime"],
		],
		rules: {
			"react/jsx-filename-extension": [
				"error",
				{ extensions: [".tsx", ".jsx"] },
			],
			"react/prop-types": "off",
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
		extends: [vitest.configs.all],
		rules: {
			"vitest/no-hooks": "off",
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
