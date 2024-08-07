/** @type {import("node:path")} */
const path = require("node:path");

const { importOrderConfig } = require("../../.eslint.helpers.cjs");

/** @param {Parameters<typeof path.resolve>} args */
function fromDirname(...args) {
	return path.resolve(__dirname, ...args);
}

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
	patterns: [{ group: ["electron-log/main"] }],
};

const restrictFromNode = {
	paths: [{ name: "solid-js" }, { name: "@trpc/client" }],
	patterns: [
		{
			group: ["solid-*", "@solidjs/-*", "tailwind-*", "electron-log/renderer"],
		},
	],
};

/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
	settings: {
		"import-x/parsers": {
			"@typescript-eslint/parser": [".ts", ".tsx"],
		},
		"import-x/resolver": {
			"eslint-import-resolver-typescript": {
				project: fromDirname("./tsconfig.json"),
			},
		},
	},
	rules: {
		"import-x/order": importOrderConfig("tsconfig.json"),

		// enforce context isolation
		"import-x/no-restricted-paths": [
			"error",
			{
				zones: [
					// [target] cannot import [from]
					{
						target: fromDirname("./src/main"),
						from: fromDirname("./src/renderer"),
					},
					{
						target: fromDirname("./src/main"),
						from: fromDirname("./src/preload"),
					},
					{
						target: fromDirname("./src/renderer"),
						from: fromDirname("./src/main"),
					},
					{
						target: fromDirname("./src/renderer"),
						from: fromDirname("./src/preload"),
					},
					{
						target: fromDirname("./src/common"),
						from: fromDirname("./src/main"),
					},
					{
						target: fromDirname("./src/common"),
						from: fromDirname("./src/renderer"),
					},
					{
						target: fromDirname("./src/common"),
						from: fromDirname("./src/preload"),
					},
					{
						target: fromDirname("./src/preload"),
						from: fromDirname("./src/main"),
					},
					{
						target: fromDirname("./src/preload"),
						from: fromDirname("./src/renderer"),
					},
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
