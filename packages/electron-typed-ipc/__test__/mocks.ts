import type { ipcMain, ipcRenderer } from "electron";

export function createMockIpcMain() {
	return {
		handle: () => undefined,
		send: () => undefined,
		sendToFrame: () => undefined,
		addListener: () => undefined,
		removeListener: () => undefined,
	} as unknown as typeof ipcMain;
}

export function createMockIpcRenderer() {
	return {
		invoke: () => undefined,
		send: () => undefined,
		sendToHost: () => undefined,
		addListener: () => undefined,
		removeListener: () => undefined,
	} as unknown as typeof ipcRenderer;
}
