import { vi } from "vitest";

import {
	createMockIpcMain,
	createMockIpcRenderer,
	createMockBrowserWindow,
} from "./src/__test__/mocks.ts";

vi.mock("electron", () => ({
	ipcMain: createMockIpcMain(),
	ipcRenderer: createMockIpcRenderer(),
	BrowserWindow: createMockBrowserWindow(),
}));
