import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { defineConfig } from "electron-vite";
import bundleObfuscator from "vite-plugin-bundle-obfuscator";
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
		options: { optionsPreset: "default", sourceMap: true },
	});
}

function getRouterConfig(): Parameters<typeof tanstackRouter>[0] {
	return {
		...tsrConfig,
		routesDirectory: path.resolve(dirname, tsrConfig.routesDirectory),
		generatedRouteTree: path.resolve(dirname, tsrConfig.generatedRouteTree),
	};
}

export default defineConfig(({ mode }) => {
	return {
		main: {
			resolve: { conditions: ["node", mode], tsconfigPaths: true },
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
		},
		preload: {
			resolve: { conditions: [mode], tsconfigPaths: true },
			build: {
				minify: "terser",
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
			plugins: [obfuscator(mode)],
		},
		renderer: {
			resolve: { conditions: ["browser", mode], tsconfigPaths: true },
			build: { minify: false, cssMinify: mode === "production" },
			plugins: [
				devtools(),
				tanstackRouter(getRouterConfig()),
				react({
					babel: { plugins: [["babel-plugin-react-compiler", {}]] },
				}),
				tailwindcss(),
				obfuscator(mode),
			],
		},
	};
});
