import path from "node:path";
import { fileURLToPath } from "node:url";

import jestDom from "eslint-plugin-jest-dom";
import playwright from "eslint-plugin-playwright";
import { default as react } from "eslint-plugin-react";
// @ts-expect-error no types available
import reactCompiler from "eslint-plugin-react-compiler";
// @ts-expect-error no types available
import reactHooks from "eslint-plugin-react-hooks";
import tailwindcss from "eslint-plugin-tailwindcss";
import testingLibrary from "eslint-plugin-testing-library";
import vitest from "eslint-plugin-vitest";
import globals from "globals";
import * as tsEslint from "typescript-eslint";

import baseConfig from "../../eslint.config.js";
import { testFilePatterns } from "../../eslint.helpers.js";

import importsConfig from "./eslint.imports.js";

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
