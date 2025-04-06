import { defineConfig } from "tsup";

export default defineConfig([
	{
		tsconfig: "./src/tsconfig.json",
		clean: true,
		dts: true,
		target: ["node20", "chrome130"],
		entry: [
			"./src/common.ts",
			"./src/main.ts",
			"./src/renderer.ts",
			"./src/test-renderer.ts",
		],
		format: ["cjs", "esm"],
	},
	{
		tsconfig: "./src/tsconfig.json",
		clean: false,
		dts: true,
		target: ["node20", "chrome130"],
		entry: ["./src/preload.ts"],
		format: ["cjs"],
	},
]);
