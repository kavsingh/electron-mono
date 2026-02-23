import solid from "eslint-plugin-solid";
import { defineConfig } from "eslint/config";
import { configs as tsEslint } from "typescript-eslint";

// TODO: move solid plugin to oxlint once missing apis implemented

export default defineConfig(
	{
		ignores: ["out/*", "dist/*", "reports/*"],
	},

	{
		files: ["src/**/*.{ts,tsx}"],
		ignores: ["src/**/__generated__/*", "src/**/*.gen.ts"],
		extends: [
			tsEslint.base,
			// @ts-expect-error upstream types
			solid.configs["flat/typescript"],
		],
	},
);
