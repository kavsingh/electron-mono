/** @type {import("path")} */
const path = require("node:path");

/** @type {any} */
const { importOrderConfig } = require("../../.eslint.helpers.cjs");

const testFileSuffixes = ["test", "spec", "mock"];

/** @type {import("eslint").ESLint.ConfigData} */
module.exports = {
	root: true,
	parserOptions: { project: path.resolve(__dirname, "./tsconfig.json") },
	settings: {
		"import/resolver": {
			"eslint-import-resolver-typescript": {
				project: path.resolve(__dirname, "./tsconfig.json"),
			},
		},
	},
	extends: [require.resolve("../../.eslintrc.cjs")],
	rules: {
		"import/order": importOrderConfig("tsconfig.json"),
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
				"import/parsers": { "@typescript-eslint/parser": [".ts", ".tsx"] },
				"tailwindcss": { callees: ["twMerge", "twJoin"] },
			},
			extends: ["plugin:tailwindcss/recommended", "plugin:solid/typescript"],
			rules: {
				"no-console": "error",
			},
		},
		{
			files: ["src/routes/*.tsx"],
			rules: { "filenames/match-exported": "off" },
		},
		{
			files: testFilePatterns(),
			env: { node: true },
			extends: ["plugin:vitest/all"],
			rules: {
				"no-console": "off",
				"filenames/match-exported": [
					"error",
					"kebab",
					`\\.(${testFileSuffixes.join("|")})$`,
				],
				"vitest/no-hooks": "off",
				"@typescript-eslint/no-explicit-any": "off",
				"@typescript-eslint/no-non-null-assertion": "off",
				"@typescript-eslint/no-unsafe-argument": "off",
				"@typescript-eslint/no-unsafe-assignment": "off",
				"@typescript-eslint/no-unsafe-call": "off",
				"@typescript-eslint/no-unsafe-member-access": "off",
				"@typescript-eslint/no-unsafe-return": "off",
				"@typescript-eslint/unbound-method": "off",
			},
		},
		{
			files: testFilePatterns({ root: "./src", extensions: "[jt]sx" }),
			extends: ["plugin:testing-library/dom", "plugin:jest-dom/recommended"],
		},
	],
};

function testFilePatterns({ root = "", extensions = "*" } = {}) {
	return [
		`*.{${testFileSuffixes.join(",")}}`,
		"__{test,tests,mocks,fixtures}__/**/*",
		"__{test,mock,fixture}-*__/**/*",
	].map((pattern) => path.join(root, `**/${pattern}.${extensions}`));
}
