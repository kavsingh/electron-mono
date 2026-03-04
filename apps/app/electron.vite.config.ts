import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { defineConfig } from "electron-vite";
import solid from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";

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
			plugins: [tsconfigPaths()],
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
			plugins: [tsconfigPaths()],
		},
		renderer: {
			build,
			resolve: { conditions: ["browser", mode] },
			plugins: [
				devtools(),
				tsconfigPaths(),
				tanstackRouter(),
				solid(),
				tailwindcss(),
			],
		},
	};
});
