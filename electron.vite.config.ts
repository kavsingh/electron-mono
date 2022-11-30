/// <reference types="vitest" />

import { resolve } from "path";

import reactPlugin from "@vitejs/plugin-react";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";

const srcAlias = { "~": resolve(__dirname, "./src") };

export default defineConfig({
	main: {
		resolve: { alias: srcAlias },
		plugins: [externalizeDepsPlugin()],
	},
	preload: {
		resolve: { alias: srcAlias },
		plugins: [externalizeDepsPlugin()],
	},
	renderer: {
		resolve: { alias: srcAlias },
		plugins: [reactPlugin()],
	},
});
