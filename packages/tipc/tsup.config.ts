import { defineConfig } from "tsup";

export default defineConfig({
	clean: true,
	dts: true,
	entry: [
		"./src/common.ts",
		"./src/main.ts",
		"./src/preload.ts",
		"./src/renderer.ts",
	],
	format: ["cjs", "esm"],
});
