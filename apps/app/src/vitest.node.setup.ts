import { fs } from "memfs";
import { vi } from "vitest";

vi.mock("node:fs", () => ({ ...fs, default: fs }));
vi.mock("node:fs/promises", () => ({ ...fs.promises, default: fs.promises }));

vi.mock("electron-log", () => ({
	default: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));
