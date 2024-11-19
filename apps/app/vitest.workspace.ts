import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
	{ extends: "./vitest.node.config.ts" },
	{ extends: "./vitest.renderer.config.ts" },
]);
