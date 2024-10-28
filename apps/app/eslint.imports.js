import { builtinModules } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

import importsPlugin from "eslint-plugin-import-x";
import * as tsEslint from "typescript-eslint";

const dirname = path.dirname(fileURLToPath(import.meta.url));

function fromDirname(/** @type {Parameters<typeof path.resolve>} */ ...args) {
	return path.resolve(dirname, ...args);
}

const restrictFromBrowser = {
	paths: [
		{ name: "electron", allowTypeImports: true },
		{ name: "systeminformation", allowTypeImports: true },
		{ name: "@trpc/server", allowTypeImports: true },
		{ name: "eventemitter3", allowTypeImports: true },
		...builtinModules.map((mod) => ({ name: mod, allowTypeImports: true })),
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

export default tsEslint.config(
	importsPlugin.flatConfigs.electron,

	{
		settings: {
			"import-x/resolver": {
				"eslint-import-resolver-typescript": {
					project: fromDirname("./tsconfig.json"),
				},
			},
		},
		rules: {
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

			"no-restricted-imports": "off",
		},
	},

	// node processes should not import browser modules
	{
		files: ["*.?([mc])js?(x)"],
		rules: {
			"@typescript-eslint/no-restricted-imports": ["error", restrictFromNode],
		},
	},

	// common should not import modules exclusive to either node or browser
	{
		files: ["src/common/**/*.?([mc])js?(x)"],
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
		files: ["src/main/**/*.?([mc])js?(x)"],
		rules: {
			"@typescript-eslint/no-restricted-imports": ["error", restrictFromNode],
		},
	},

	{
		files: ["src/renderer/**/*.?([mc])js?(x)"],
		rules: {
			"@typescript-eslint/no-restricted-imports": [
				"error",
				restrictFromBrowser,
			],
		},
	},

	{
		files: ["src/preload/**/*.?([mc])js?(x)"],
		rules: {
			"@typescript-eslint/no-restricted-imports": [
				"error",
				{
					paths: [
						...restrictFromBrowser.paths,
						...restrictFromNode.paths,
					].filter(({ name }) => !name.startsWith("electron")),
					patterns: restrictFromNode.patterns,
				},
			],
		},
	},
);
