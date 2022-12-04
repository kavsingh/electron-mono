import { resolve } from "path";

import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import solidPlugin from "vite-plugin-solid";

import type { AliasOptions, UserConfig } from "vite";

const alias: AliasOptions = { "~": resolve(__dirname, "./src") };
const define = { E2E: JSON.stringify(process.env["E2E"] === "true") };

export const nodeConfig: UserConfig = {
	define,
	resolve: { alias, conditions: ["development", "node"] },
	plugins: [externalizeDepsPlugin()],
};

export const rendererConfig: UserConfig = {
	define,
	resolve: { alias, conditions: ["development", "browser"] },
	plugins: [solidPlugin()],
};

export default defineConfig({
	main: nodeConfig,
	preload: nodeConfig,
	renderer: rendererConfig,
});
