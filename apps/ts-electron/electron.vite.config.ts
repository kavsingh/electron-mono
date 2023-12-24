/// <reference types="vitest" />

import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import solidPlugin from "vite-plugin-solid";
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
	plugins: [tsconfigPathsPlugin(), solidPlugin()],
};

const preloadConfig: UserConfig = {
	...nodeConfig,
	build: {
		...nodeConfig.build,
		rollupOptions: {
			output: {
				format: "cjs",
				inlineDynamicImports: true,
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
