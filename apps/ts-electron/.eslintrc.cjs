/** @type {import("node:path")} */
const path = require("node:path");

/** @type {import("../../.eslint.helpers.cjs")} */
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
			extends: ["plugin:solid/typescript"],
		},
		{
			files: ["./src/renderer/**/*.tsx"],
			settings: {
				tailwindcss: { callees: ["twMerge", "twJoin", "classList"] },
			},
			extends: ["plugin:tailwindcss/recommended"],
		},
		{
			files: testFilePatterns({ root: "./src" }),
			extends: ["plugin:vitest/all"],
			rules: {
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
