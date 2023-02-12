import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import solidPlugin from "vite-plugin-solid";
import tsconfigPathsPlugin from "vite-tsconfig-paths";

import type { UserConfig } from "vite";

const isE2E = process.env["E2E"] === "true";

const define = {
	E2E: JSON.stringify(isE2E),
} satisfies NonNullable<UserConfig["define"]>;

const build = {
	minify: isE2E && "esbuild",
	sourcemap: !isE2E,
} satisfies NonNullable<UserConfig["build"]>;

export const nodeConfig: UserConfig = {
	define,
	build,
	resolve: { conditions: ["node"] },
	plugins: [tsconfigPathsPlugin(), externalizeDepsPlugin()],
};

export const rendererConfig: UserConfig = {
	define,
	build,
	resolve: { conditions: ["browser"] },
	plugins: [tsconfigPathsPlugin(), solidPlugin()],
};

export default defineConfig({
	main: nodeConfig,
	preload: nodeConfig,
	renderer: rendererConfig,
});
