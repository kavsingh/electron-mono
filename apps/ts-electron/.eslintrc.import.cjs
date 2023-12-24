/** @type {import("node:path")} */
const path = require("node:path");

/** @type {import("../../.eslint.helpers.cjs")} */
const { readTsConfig } = require("../../.eslint.helpers.cjs");

const tsconfigPathPatterns = Object.keys(
	readTsConfig(__dirname)?.compilerOptions?.paths ?? {},
);

const restrictFromBrowser = {
	paths: [
		{ name: "electron", allowTypeImports: true },
		{ name: "systeminformation", allowTypeImports: true },
		{ name: "@trpc/server", allowTypeImports: true },
		{ name: "eventemitter3", allowTypeImports: true },
		...require("module").builtinModules.map(
			/** @param {string} mod **/
			(mod) => ({ name: mod, allowTypeImports: true }),
		),
	],
};

const restrictFromNode = {
	paths: [{ name: "solid-js" }, { name: "@trpc/client" }],
	patterns: [{ group: ["solid-*", "@solidjs/-*", "tailwind-*"] }],
};

/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
	settings: {
		"import/parsers": {
			"@typescript-eslint/parser": [".ts", ".tsx"],
		},
		"import/resolver": {
			"eslint-import-resolver-typescript": {
				project: path.resolve(__dirname, "./tsconfig.json"),
			},
		},
	},
	rules: {
		"import/order": [
			"warn",
			{
				"groups": [
					"builtin",
					"external",
					"internal",
					"parent",
					["sibling", "index"],
					"type",
				],
				"pathGroups": [
					...tsconfigPathPatterns.map((pattern) => ({
						pattern,
						group: "internal",
					})),
				],
				"pathGroupsExcludedImportTypes": ["type"],
				"alphabetize": { order: "asc" },
				"newlines-between": "always",
			},
		],

		// enforce context isolation
		"import/no-restricted-paths": [
			"error",
			{
				zones: [
					// [target] cannot import [from]
					{ target: "./src/main", from: "./src/renderer" },
					{ target: "./src/main", from: "./src/preload" },
					{ target: "./src/renderer", from: "./src/main" },
					{ target: "./src/renderer", from: "./src/preload" },
					{ target: "./src/common", from: "./src/main" },
					{ target: "./src/common", from: "./src/renderer" },
					{ target: "./src/common", from: "./src/preload" },
					{ target: "./src/preload", from: "./src/main" },
					{ target: "./src/preload", from: "./src/renderer" },
				],
			},
		],

		// node processes should not import browser modules
		"no-restricted-imports": "off",
		"@typescript-eslint/no-restricted-imports": ["error", restrictFromNode],
	},
	overrides: [
		// common should not import modules exclusive to either node or browser
		{
			files: ["src/common/**/*"],
			rules: {
				"@typescript-eslint/no-restricted-imports": [
					"error",
					{
						paths: [...restrictFromBrowser.paths, ...restrictFromNode.paths],
						patterns: restrictFromNode.patterns,
					},
				],
			},
		},

		{
			files: ["src/main/**/*"],
			rules: {
				"@typescript-eslint/no-restricted-imports": ["error", restrictFromNode],
			},
		},

		{
			files: ["src/renderer/**/*"],
			rules: {
				"@typescript-eslint/no-restricted-imports": [
					"error",
					restrictFromBrowser,
				],
			},
		},

		{
			files: ["src/preload/**/*"],
			rules: {
				"@typescript-eslint/no-restricted-imports": [
					"error",
					{
						paths: [
							...restrictFromBrowser.paths,
							...restrictFromNode.paths,
						].filter(({ name }) => !/^electron/.test(name)),
						patterns: restrictFromNode.patterns,
					},
				],
			},
		},
	],
};
