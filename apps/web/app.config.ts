import { defineConfig } from "@solidjs/start/config";
import tsconfigPathsPlugin from "vite-tsconfig-paths";

export default defineConfig({ vite: { plugins: [tsconfigPathsPlugin()] } });
