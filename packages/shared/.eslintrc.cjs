/** @type {import("path")} */
const path = require("node:path");

const { importOrderConfig } = require("../../.eslint.helpers.cjs");

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
	],
};
