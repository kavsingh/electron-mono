import { resolve } from "path";

import reactPlugin from "@vitejs/plugin-react";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";

import type { AliasOptions, UserConfig } from "vite";

const alias: AliasOptions = { "~": resolve(__dirname, "./src") };
const define = { E2E: JSON.stringify(process.env["E2E"] === "true") };

export const nodeConfig: UserConfig = {
	define,
	resolve: { alias },
	plugins: [externalizeDepsPlugin()],
};

export const rendererConfig: UserConfig = {
	define,
	resolve: { alias },
	plugins: [reactPlugin()],
};

export default defineConfig({
	main: nodeConfig,
	preload: nodeConfig,
	renderer: rendererConfig,
});
