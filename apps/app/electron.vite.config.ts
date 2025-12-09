import path from "node:path";

import tailwindcssPlugin from "@tailwindcss/vite";
import reactPlugin from "@vitejs/plugin-react";
import { defineConfig } from "electron-vite";
import tsconfigPathsPlugin from "vite-tsconfig-paths";

const dirname = import.meta.dirname;

export default defineConfig(({ mode }) => {
	const build =
		mode === "production"
			? { minify: "esbuild" as const, sourcemap: true }
			: { minify: false, sourcemap: false };

	return {
		main: {
			build: { ...build, externalizeDeps: { exclude: ["trpc-electron"] } },
			resolve: { conditions: ["node"] },
			plugins: [tsconfigPathsPlugin()],
		},
		preload: {
			build: {
				...build,
				externalizeDeps: { exclude: ["trpc-electron"] },
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
			plugins: [tsconfigPathsPlugin()],
		},
		renderer: {
			build,
			resolve: { conditions: ["browser", mode] },
			plugins: [
				tsconfigPathsPlugin(),
				reactPlugin({
					babel: { plugins: [["babel-plugin-react-compiler", {}]] },
				}),
				tailwindcssPlugin(),
			],
		},
	};
});
