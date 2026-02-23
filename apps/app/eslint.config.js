import path from "node:path";

import vitest from "@vitest/eslint-plugin";
import { defineConfig } from "eslint/config";
import tailwindcss from "eslint-plugin-better-tailwindcss";
import { getDefaultSelectors } from "eslint-plugin-better-tailwindcss/defaults";
import {
	MatcherType,
	SelectorKind,
} from "eslint-plugin-better-tailwindcss/types";
import jestDom from "eslint-plugin-jest-dom";
import playwright from "eslint-plugin-playwright";
import solid from "eslint-plugin-solid";
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
		extends: [
			// @ts-expect-error upstream types
			solid.configs["flat/typescript"],
			tailwindcss.configs["recommended-error"],
		],
		settings: {
			"better-tailwindcss": {
				entryPoint: path.resolve(
					import.meta.dirname,
					"./src/renderer/index.css",
				),
				selectors: [
					...getDefaultSelectors(),
					...["tj", "tm"].map((name) => ({
						name,
						kind: SelectorKind.Callee,
						match: [{ type: MatcherType.String }],
					})),
				],
			},
		},
		rules: {
			"better-tailwindcss/enforce-consistent-line-wrapping": "off",
			"better-tailwindcss/enforce-shorthand-classes": "error",
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
		extends: [vitest.configs.all],
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
			testingLibrary.configs["flat/dom"],
			jestDom.configs["flat/recommended"],
		],
	},

	{
		files: testFilePatterns({ root: "e2e" }),
		extends: [playwright.configs["flat/recommended"]],
	},
);
