/** @type {import("path")} */
const path = require("node:path");

/** @type {import("eslint-plugin-vitest")} */
const vitest = require("eslint-plugin-vitest");

const {
	importOrderConfig,
	testFilePatterns,
} = require("../../.eslint.helpers.cjs");

/** @type {import("eslint").ESLint.ConfigData} */
module.exports = {
	root: true,
	parserOptions: { project: path.resolve(__dirname, "./tsconfig.json") },
	settings: {
		"import-x/resolver": {
			"eslint-import-resolver-typescript": {
				project: path.resolve(__dirname, "./tsconfig.json"),
			},
		},
	},
	extends: [require.resolve("../../.eslintrc.cjs")],
	rules: {
		"import-x/order": importOrderConfig("tsconfig.json"),
	},
	overrides: [
		{
			files: ["./*"],
			rules: {
				"filenames/match-exported": "off",
			},
		},
		{
			files: ["src/**/*"],
			env: { node: false, browser: true },
			settings: {
				"import-x/parsers": { "@typescript-eslint/parser": [".ts", ".tsx"] },
				"tailwindcss": { callees: ["twMerge", "twJoin"] },
			},
			extends: ["plugin:tailwindcss/recommended", "plugin:solid/typescript"],
			rules: {
				"no-console": "error",
			},
		},
		{
			files: ["src/routes/**/*.ts", "src/routes/**/*.tsx"],
			rules: {
				"filenames/match-exported": "off",
				"filenames/match-regex": "off",
			},
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
			files: testFilePatterns({ root: "./src", extensions: "[jt]sx" }),
			extends: ["plugin:testing-library/dom", "plugin:jest-dom/recommended"],
		},
	],
};
