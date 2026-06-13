import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import dotenv from "dotenv";
import { defineConfig } from "electron-vite";
import bundleObfuscator from "vite-plugin-bundle-obfuscator";
import solid from "vite-plugin-solid";
import { ConfigEnv, Plugin } from "vitest/config";

import tsrConfig from "./tsr.config.json" with { type: "json" };

const dirname = import.meta.dirname;

dotenv.config({ path: path.resolve(dirname, "./.env") });

function isDefinedNotNull<T>(value: T): value is NonNullable<T> {
	return value !== null && typeof value !== "undefined";
}

function obfuscator(
	mode: ConfigEnv["mode"],
	protectedStrings?: string[],
): Plugin {
	// @ts-expect-error errant type exports upstream
	// oxlint-disable-next-line typescript/no-unsafe-return
	return bundleObfuscator({
		enable: mode === "production",
		apply: "build",
		excludes: [/node_modules/],
		options: {
			optionsPreset: "default",
			sourceMap: true,
			...(protectedStrings?.length
				? {
						forceTransformStrings: protectedStrings,
						stringArrayEncoding: ["base64"],
					}
				: {}),
		},
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
	const mainProtectedStrings = [process.env["MAIN_VITE_SOME_KEY"]].filter(
		isDefinedNotNull,
	);

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

				// @TODO: re-enable this when fixed in electron-vite for electron 42
				// https://github.com/alex8088/electron-vite/issues/911
				// bytecode: { protectedStrings: mainProtectedStrings },

				// @TODO: remove when bytecode support is re-enabled
				minify: mode === "production" ? "terser" : false,
			},
			// @TODO: remove when bytecode support is re-enabled
			plugins: [obfuscator(mode, mainProtectedStrings)],
		},
		preload: {
			resolve: { conditions: [mode], tsconfigPaths: true },
			build: {
				minify: mode === "production" ? "terser" : false,
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
			build: { cssMinify: mode === "production" },
			plugins: [
				devtools(),
				tanstackRouter(getRouterConfig()),
				solid(),
				tailwindcss(),
				obfuscator(mode),
			],
		},
	};
});
