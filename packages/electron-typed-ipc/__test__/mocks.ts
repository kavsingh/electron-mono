import { vi } from "vitest";

import type { BrowserWindow, ipcMain, ipcRenderer } from "electron";

export function createMockIpcMain() {
	return {
		handle: vi.fn(() => undefined),
		send: vi.fn(() => undefined),
		sendToFrame: vi.fn(() => undefined),
		addListener: vi.fn(() => undefined),
		removeListener: vi.fn(() => undefined),
	} as unknown as typeof ipcMain;
}

export function createMockIpcRenderer() {
	return {
		invoke: vi.fn(() => undefined),
		send: vi.fn(() => undefined),
		sendToHost: vi.fn(() => undefined),
		addListener: vi.fn(() => undefined),
		removeListener: vi.fn(() => undefined),
	} as unknown as typeof ipcRenderer;
}

export function createMockBrowserWindow() {
	return {
		getAllWindows: vi.fn(() => []),
	} as unknown as typeof BrowserWindow;
}
