import path from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcssPlugin from "@tailwindcss/vite";
import { defineConfig } from "electron-vite";
import solidPlugin from "vite-plugin-solid";
import tsconfigPathsPlugin from "vite-tsconfig-paths";

import type { UserConfig } from "vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const define = {
	E2E: JSON.stringify(process.env["E2E"] === "true"),
} satisfies NonNullable<UserConfig["define"]>;

export default defineConfig(({ mode }) => {
	const build =
		mode === "production"
			? { minify: "esbuild" as const, sourcemap: true }
			: { minify: false, sourcemap: false };

	return {
		main: {
			define,
			build: { ...build, externalizeDeps: { exclude: ["trpc-electron"] } },
			resolve: { conditions: ["node"] },
			plugins: [tsconfigPathsPlugin()],
		},
		preload: {
			define,
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
			define,
			build,
			resolve: { conditions: ["browser", mode] },
			plugins: [tsconfigPathsPlugin(), solidPlugin(), tailwindcssPlugin()],
		},
	};
});
