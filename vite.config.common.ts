import { resolve } from "path";

import type { AliasOptions } from "vite";

export const alias: AliasOptions = { "~": resolve(__dirname, "./src") };
