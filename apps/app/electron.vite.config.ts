/// <reference types="vitest" />
import path from "node:path";

import reactPlugin from "@vitejs/plugin-react";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import tsconfigPathsPlugin from "vite-tsconfig-paths";

import type { UserConfig } from "vite";

const isE2E = process.env["E2E"] === "true";

const define = {
	E2E: JSON.stringify(isE2E),
} satisfies NonNullable<UserConfig["define"]>;

const build = {
	minify: isE2E ? "esbuild" : false,
	sourcemap: !isE2E,
} satisfies NonNullable<UserConfig["build"]>;

export const nodeConfig: UserConfig = {
	define,
	build,
	resolve: { conditions: ["node"] },
	plugins: [
		tsconfigPathsPlugin(),
		// workaround after this PR:
		// https://github.com/alex8088/electron-vite/pull/254
		externalizeDepsPlugin({ exclude: ["electron-trpc"] }),
	],
};

export const rendererConfig: UserConfig = {
	define,
	build,
	resolve: { conditions: ["browser"] },
	plugins: [
		reactPlugin({
			babel: { plugins: [["babel-plugin-react-compiler", {}]] },
		}),
		tsconfigPathsPlugin(),
	],
};

const preloadConfig: UserConfig = {
	...nodeConfig,
	build: {
		...nodeConfig.build,
		rollupOptions: {
			input: {
				renderer: path.resolve(__dirname, "src/preload/renderer.ts"),
				web: path.resolve(__dirname, "src/preload/web.ts"),
			},
			output: {
				format: "cjs",
				// inlineDynamicImports: true,
				entryFileNames: "[name].cjs",
				chunkFileNames: "[name].cjs",
				assetFileNames: "[name].[ext]",
			},
		},
	},
};

export default defineConfig({
	main: nodeConfig,
	preload: preloadConfig,
	renderer: rendererConfig,
});
