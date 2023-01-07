import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import solidPlugin from "vite-plugin-solid";
import tsconfigPathsPlugin from "vite-tsconfig-paths";

import type { UserConfig } from "vite";

const define = { E2E: JSON.stringify(process.env["E2E"] === "true") };

export const nodeConfig: UserConfig = {
	define,
	resolve: { conditions: ["node"] },
	plugins: [tsconfigPathsPlugin(), externalizeDepsPlugin()],
};

export const rendererConfig: UserConfig = {
	define,
	resolve: { conditions: ["browser"] },
	plugins: [tsconfigPathsPlugin(), solidPlugin()],
};

export default defineConfig({
	main: nodeConfig,
	preload: nodeConfig,
	renderer: rendererConfig,
});
