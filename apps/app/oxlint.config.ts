import { builtinModules } from "node:module";
import path from "node:path";

import tailwindcss from "eslint-plugin-better-tailwindcss";
import { getDefaultSelectors } from "eslint-plugin-better-tailwindcss/defaults";
import {
	MatcherType,
	SelectorKind,
} from "eslint-plugin-better-tailwindcss/types";
import jestDom from "eslint-plugin-jest-dom";
import playwright from "eslint-plugin-playwright";
import testingLibrary from "eslint-plugin-testing-library";
import { defineConfig } from "oxlint";

import baseConfig from "../../oxlint.config.ts";

const restrictImportsNode = {
	paths: [{ name: "solid-js" }, { name: "@trpc/client" }],
	patterns: [
		{
			group: ["solid-*", "@solidjs/-*", "tailwind-*", "electron-log/renderer"],
			allowTypeImports: true,
		},
	],
};

const restrictImportsBrowser = {
	paths: [
		{ name: "electron", allowTypeImports: true },
		{ name: "systeminformation", allowTypeImports: true },
		{ name: "@trpc/server", allowTypeImports: true },
		...builtinModules.map((mod) => ({ name: mod, allowTypeImports: true })),
	],
	patterns: [{ group: ["electron-log/main"], allowTypeImports: true }],
};

export default defineConfig({
	extends: [baseConfig],
	env: { node: true, browser: false },
	ignorePatterns: [
		"dist/**",
		"out/**",
		"reports/**",
		"**/*.gen.*",
		"**/__generated__/**",
		"!**/__generated__/__mocks__/**",
	],
	settings: {
		vitest: { typecheck: true },

		"jsx-a11y": {
			attributes: { for: ["for"] },
		},

		"better-tailwindcss": {
			entryPoint: path.resolve(import.meta.dirname, "./src/renderer/index.css"),
			selectors: [
				...getDefaultSelectors(),
				...["tj", "tm"].map((name) => ({
					name,
					kind: SelectorKind.Callee,
					match: [{ type: MatcherType.String }],
				})),
				...["^classNames$", "^.+ClassNames$"].map((name) => ({
					name,
					kind: SelectorKind.Attribute,
					match: [
						{ type: MatcherType.String },
						{ type: MatcherType.ObjectValue },
					],
				})),
				{
					name: "^.+ClassName$",
					kind: SelectorKind.Variable,
					match: [{ type: MatcherType.String }],
				},
				{
					name: "^.+ClassNames$",
					kind: SelectorKind.Variable,
					match: [
						{ type: MatcherType.String },
						{ type: MatcherType.ObjectValue },
					],
				},
			],
		},
	},
	overrides: [
		{
			files: ["./build/**/*.{ts,js}"],
			rules: { "import/no-default-export": "off" },
		},

		{
			files: ["./src/**/*.{ts,tsx}"],
			rules: { "eslint/no-console": "error" },
		},

		{
			files: ["./src/common/**/*.{ts,tsx}"],
			env: { node: false, browser: false },
			rules: {
				"eslint/no-console": "error",
				"eslint/no-restricted-imports": [
					"error",
					{
						paths: [
							...restrictImportsBrowser.paths,
							...restrictImportsNode.paths,
						],
						patterns: [
							...restrictImportsBrowser.patterns,
							...restrictImportsNode.patterns,
							{
								group: ["#main/*", "#preload/*", "#renderer/*"],
								allowTypeImports: true,
							},
						],
					},
				],
			},
		},

		{
			files: ["./src/main/**/*.ts"],
			env: { node: true, browser: false },
			rules: {
				"eslint/no-restricted-imports": [
					"error",
					{
						paths: restrictImportsNode.paths,
						patterns: [
							...restrictImportsNode.patterns,
							{
								group: ["#common/*", "#preload/*", "#renderer/*"],
								allowTypeImports: true,
							},
						],
					},
				],
			},
		},

		{
			files: ["./src/preload/**/*.ts"],
			env: { node: true, browser: true },
			rules: {
				"eslint/no-restricted-imports": [
					"error",
					{
						paths: [
							...restrictImportsBrowser.paths,
							...restrictImportsNode.paths,
						].filter(({ name }) => name !== "electron"),
						patterns: [
							...restrictImportsBrowser.patterns,
							...restrictImportsNode.patterns,
							{
								group: ["#common/*", "#main/*", "#renderer/*"],
								allowTypeImports: true,
							},
						],
					},
				],
			},
		},

		{
			files: ["./src/renderer/**/*.{ts,tsx}"],
			env: { node: false, browser: true },
			plugins: ["import", "jsx-a11y"],
			jsPlugins: ["eslint-plugin-better-tailwindcss"],
			rules: {
				"eslint/no-restricted-imports": [
					"error",
					{
						paths: [
							...restrictImportsBrowser.paths,
							{
								name: "tailwind-merge",
								message: "please import helpers from #src/style",
							},
							{
								name: "tailwind-variants",
								message: "please import helpers from #src/style",
							},
						],
						patterns: [
							...restrictImportsBrowser.patterns,
							{
								group: ["#common/*", "#main/*", "#preload/*"],
								allowTypeImports: true,
							},
						],
					},
				],

				"import/no-nodejs-modules": "error",
				"import/no-unassigned-import": ["error", { allow: ["**/*.css"] }],

				...tailwindcss.configs["recommended-error"].rules,
				"better-tailwindcss/enforce-consistent-line-wrapping": "off",
				"better-tailwindcss/enforce-shorthand-classes": "error",
			},
		},

		{
			files: ["./src/renderer/**/*.tsx"],
			rules: { "typescript/strict-void-return": "off" },
		},

		{
			files: [
				"./src/**/__test-helpers__/**/*.{ts,tsx}",
				"./src/**/*.test.{ts,tsx}",
			],
			plugins: ["typescript"],
			rules: {
				"typescript/unbound-method": "off",
				"typescript/no-non-null-assertion": "off",
				"typescript/no-unsafe-assignment": "off",
				"typescript/no-unsafe-call": "off",
				"typescript/no-unsafe-type-assertion": "off",
			},
		},

		{
			files: ["./src/**/*.test.{ts,tsx}", "./src/**/*.test-d.{ts,tsx}"],
			plugins: ["vitest"],
			rules: {
				"vitest/no-disabled-tests": "error",
				"vitest/no-focused-tests": "error",
				"vitest/no-import-node-test": "error",
			},
		},

		{
			files: [
				"./src/renderer/**/*.test.{ts,tsx}",
				"./src/renderer/**/*.test-d.{ts,tsx}",
			],
			plugins: ["vitest"],
			jsPlugins: ["eslint-plugin-jest-dom", "eslint-plugin-testing-library"],
			// @ts-expect-error type inference weirdness
			rules: {
				...jestDom.configs["flat/recommended"].rules,
				...testingLibrary.configs["flat/dom"].rules,
			},
		},

		{
			files: ["./e2e/**/*.test.ts"],
			jsPlugins: ["eslint-plugin-playwright"],
			// @ts-expect-error type inference weirdness
			rules: { ...playwright.configs["flat/recommended"].rules },
		},
	],
});
