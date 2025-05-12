import path from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcssPlugin from "@tailwindcss/vite";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import solidPlugin from "vite-plugin-solid";
import tsconfigPathsPlugin from "vite-tsconfig-paths";

import type { UserConfig, UserConfigFn } from "vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const define = {
	E2E: JSON.stringify(process.env["E2E"] === "true"),
} satisfies NonNullable<UserConfig["define"]>;

function build(mode: string): NonNullable<UserConfig["build"]> {
	return mode === "production"
		? { minify: "esbuild", sourcemap: true }
		: { minify: false, sourcemap: false };
}

export const mainConfig: UserConfigFn = ({ mode }) => {
	return {
		define,
		build: build(mode),
		resolve: { conditions: ["node"] },
		plugins: [
			tsconfigPathsPlugin(),
			externalizeDepsPlugin({ exclude: ["trpc-electron"] }),
		],
	};
};

const preloadConfig: UserConfigFn = ({ mode }) => {
	return {
		define,
		plugins: [
			tsconfigPathsPlugin(),
			externalizeDepsPlugin({ exclude: ["trpc-electron"] }),
		],
		build: {
			...build(mode),
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
};

export const rendererConfig: UserConfigFn = ({ mode }) => {
	return {
		define,
		build: build(mode),
		resolve: { conditions: ["browser", mode] },
		plugins: [tsconfigPathsPlugin(), solidPlugin(), tailwindcssPlugin()],
	};
};

export default defineConfig({
	main: mainConfig,
	preload: preloadConfig,
	renderer: rendererConfig,
});
