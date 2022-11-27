import { resolve } from "path";

import reactPlugin from "@vitejs/plugin-react";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";

import type { AliasOptions, UserConfig } from "vite";

const alias: AliasOptions = { "~": resolve(__dirname, "./src") };
const define = {
	E2E: JSON.stringify(process.env["E2E"] === "true"),
	NATIVE_API_BASE_URL: JSON.stringify(process.env["NATIVE_API_BASE_URL"]),
	NATIVE_API_USER_AGENT: JSON.stringify(process.env["NATIVE_API_USER_AGENT"]),
	NATIVE_API_APP_TOKEN: JSON.stringify(process.env["NATIVE_API_APP_TOKEN"]),
};

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
