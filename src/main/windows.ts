import { join } from "path";

import { app, BrowserWindow } from "electron";

import { error } from "~/common/log";

export function createMainWindow() {
	const mainWindow = new BrowserWindow({
		height: 600,
		width: 800,
		titleBarStyle: "hiddenInset",
		show: false,
		webPreferences: { preload: join(__dirname, "../preload/index.js") },
	});

	// HMR for renderer based on electron-vite cli.
	// Load the remote URL for development or the local html file for production.
	if (app.isPackaged || E2E) {
		void mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
	} else if (process.env["ELECTRON_RENDERER_URL"]) {
		void mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
	} else {
		error("No entry point available", {
			isPackaged: app.isPackaged,
			devUrl: process.env["ELECTRON_RENDERER_URL"],
		});
	}

	if (import.meta.env.DEV && !E2E) {
		mainWindow.webContents.openDevTools();
	}

	return mainWindow;
}
