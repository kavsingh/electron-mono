import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export const RENDERER_ROOT = path.resolve(dirname, "../renderer");
