/// <reference types="vitest" />

import { defineConfig, externalizeDepsPlugin } from "electron-vite";
// @ts-expect-error no types
import gqlPlugin from "vite-plugin-simple-gql";
import solidPlugin from "vite-plugin-solid";
import tsconfigPathsPlugin from "vite-tsconfig-paths";

import type { PluginOption, UserConfig } from "vite";

const isE2E = process.env["E2E"] === "true";

const define = {
	E2E: JSON.stringify(isE2E),
} satisfies NonNullable<UserConfig["define"]>;

const build = {
	minify: isE2E ? "esbuild" : false,
	sourcemap: !isE2E,
} satisfies NonNullable<UserConfig["build"]>;

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
const gqlPluginWrap: () => PluginOption = () => gqlPlugin.default();

export const nodeConfig: UserConfig = {
	define,
	build,
	resolve: { conditions: ["node"] },
	plugins: [tsconfigPathsPlugin(), gqlPluginWrap(), externalizeDepsPlugin()],
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
