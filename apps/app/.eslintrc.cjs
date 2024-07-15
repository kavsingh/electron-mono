/** @type {import("node:path")} */
const path = require("node:path");

/** @type {import("eslint-plugin-vitest")} */
const vitest = require("eslint-plugin-vitest");

const { testFilePatterns } = require("../../.eslint.helpers.cjs");

/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
	reportUnusedDisableDirectives: true,
	env: { es2022: true, node: true, browser: false },
	parser: "@typescript-eslint/parser",
	parserOptions: { project: path.resolve(__dirname, "tsconfig.json") },
	extends: [
		require.resolve("../../.eslintrc.cjs"),
		require.resolve("./.eslintrc.import.cjs"),
	],
	overrides: [
		{
			files: ["./src/**/*"],
			rules: {
				"no-console": "error",
			},
		},
		{
			files: ["src/renderer/**/*"],
			env: { node: false, browser: true },
			settings: {
				tailwindcss: {
					callees: ["tv", "classList"],
					config: path.join(__dirname, "tailwind.config.ts"),
				},
			},
			extends: ["plugin:solid/typescript", "plugin:tailwindcss/recommended"],
		},
		{
			files: testFilePatterns({ root: "./src" }),
			plugins: ["vitest"],
			rules: {
				// @ts-expect-error type import mismatch
				...vitest.configs.all.rules,
				"vitest/no-hooks": "off",
			},
		},
		{
			files: testFilePatterns({
				root: "./src/renderer",
				extensions: "[jt]s?(x)",
			}),
			extends: ["plugin:testing-library/dom", "plugin:jest-dom/recommended"],
		},
		{
			files: testFilePatterns({ root: "./e2e" }),
			extends: ["plugin:playwright/recommended"],
		},
	],
};
