import path from "node:path";
import { fileURLToPath } from "node:url";

import { fixupPluginRules } from "@eslint/compat";
// @ts-expect-error no types available
import jestDom from "eslint-plugin-jest-dom";
import playwright from "eslint-plugin-playwright";
import { default as react } from "eslint-plugin-react";
// @ts-expect-error no types available
import * as reactCompiler from "eslint-plugin-react-compiler";
// @ts-expect-error no types available
import reactHooks from "eslint-plugin-react-hooks";
import tailwindcss from "eslint-plugin-tailwindcss";
// @ts-expect-error no types available
import testingLibrary from "eslint-plugin-testing-library";
import vitest from "eslint-plugin-vitest";
import globals from "globals";
import * as tsEslint from "typescript-eslint";

import baseConfig from "../../eslint.config";
import { testFilePatterns } from "../../eslint.helpers";

import importsConfig from "./eslint.imports";

const dirname = path.dirname(fileURLToPath(import.meta.url));

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
			react: { version: "detect" },
		},
		extends: [
			// @ts-expect-error upstream types
			...tailwindcss.configs["flat/recommended"],
			// @ts-expect-error upstream types
			react.configs.flat.recommended,
			// @ts-expect-error upstream types
			react.configs.flat["jsx-runtime"],
		],
		plugins: {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			"react-hooks": reactHooks,
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			"react-compiler": reactCompiler,
		},
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		rules: {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			...reactHooks.configs.recommended.rules,
			"react/jsx-filename-extension": [
				"error",
				{ extensions: [".tsx", ".jsx"] },
			],
			"react/prop-types": "off",
			"react-compiler/react-compiler": "warn",
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
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		extends: [
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
			...testingLibrary.configs["flat/react"].rules,
		},
	},

	{
		files: testFilePatterns({ root: "e2e" }),
		extends: [playwright.configs["flat/recommended"]],
	},
);
