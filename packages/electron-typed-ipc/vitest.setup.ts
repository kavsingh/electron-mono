import { vi } from "vitest";

import {
	createMockIpcMain,
	createMockIpcRenderer,
	createMockBrowserWindow,
} from "./__test__/mocks";

vi.mock("electron", () => ({
	ipcMain: createMockIpcMain(),
	ipcRenderer: createMockIpcRenderer(),
	BrowserWindow: createMockBrowserWindow(),
}));
