import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import dotenv from "dotenv";
import { defineConfig } from "electron-vite";
import bundleObfuscator from "vite-plugin-bundle-obfuscator";
import solid from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";
import { ConfigEnv, Plugin } from "vitest/config";

import tsrConfig from "./tsr.config.json" with { type: "json" };

const dirname = import.meta.dirname;

dotenv.config({ path: path.resolve(dirname, "./.env") });

function isDefinedNotNull<T>(value: T): value is NonNullable<T> {
	return value !== null && typeof value !== "undefined";
}

function obfuscator(mode: ConfigEnv["mode"]): Plugin {
	// @ts-expect-error errant type exports upstream
	// oxlint-disable-next-line typescript/no-unsafe-return
	return bundleObfuscator({
		enable: mode === "production",
		apply: "build",
		excludes: [/node_modules/],
		options: { compact: true, sourceMap: true },
	});
}

function getRouterConfig() {
	const rendererDir = path.resolve(dirname, "src/renderer");

	function fromRenderer(dir: string) {
		return path.relative(rendererDir, path.resolve(dirname, dir));
	}

	// oxlint-disable-next-line typescript/no-unsafe-type-assertion
	return {
		...tsrConfig,
		routesDirectory: fromRenderer(tsrConfig.routesDirectory),
		generatedRouteTree: fromRenderer(tsrConfig.generatedRouteTree),
	} as Parameters<typeof tanstackRouter>[0];
}

export default defineConfig(({ mode }) => {
	return {
		main: {
			resolve: { conditions: ["node", mode] },
			build: {
				externalizeDeps: { exclude: ["trpc-electron"] },
				rollupOptions: {
					output: {
						format: "cjs",
						entryFileNames: "[name].cjs",
						chunkFileNames: "[name].cjs",
						assetFileNames: "[name].[ext]",
					},
				},
				bytecode: {
					protectedStrings: [process.env["MAIN_VITE_SOME_KEY"]].filter(
						isDefinedNotNull,
					),
				},
			},
			plugins: [tsconfigPaths()],
		},
		preload: {
			build: {
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
			plugins: [tsconfigPaths(), obfuscator(mode)],
		},
		renderer: {
			resolve: { conditions: ["browser", mode] },
			plugins: [
				devtools(),
				tsconfigPaths(),
				tanstackRouter(getRouterConfig()),
				solid(),
				tailwindcss(),
				obfuscator(mode),
			],
		},
	};
});
