import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "electron-vite";
import solidPlugin from "vite-plugin-solid";
import tsconfigPathsPlugin from "vite-tsconfig-paths";

import type { UserConfig, UserConfigFn } from "vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));
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
	plugins: [tsconfigPathsPlugin()],
};

export const rendererConfig: UserConfigFn = ({ mode }) => {
	return {
		define,
		build,
		resolve: { conditions: ["browser", mode] },
		plugins: [tsconfigPathsPlugin(), solidPlugin()],
	};
};

const preloadConfig: UserConfig = {
	...nodeConfig,
	build: {
		...nodeConfig.build,
		rollupOptions: {
			input: {
				renderer: path.resolve(dirname, "src/preload/renderer.ts"),
			},
			output: {
				format: "cjs",
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
