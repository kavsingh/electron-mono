import { resolve } from "path";

import reactPlugin from "@vitejs/plugin-react";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";

import type { AliasOptions, UserConfig } from "vite";

const alias: AliasOptions = { "~": resolve(__dirname, "./src") };

export const nodeConfig: UserConfig = {
	resolve: { alias },
	plugins: [externalizeDepsPlugin()],
};

export const rendererConfig: UserConfig = {
	resolve: { alias },
	plugins: [reactPlugin()],
};

export default defineConfig({
	main: nodeConfig,
	preload: nodeConfig,
	renderer: rendererConfig,
});
