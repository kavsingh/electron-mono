import { app, BrowserWindow } from "electron";
import { join } from "node:path";

import log from "electron-log";

export function createMainWindow() {
	const mainWindow = new BrowserWindow({
		titleBarStyle: "hiddenInset",
		backgroundMaterial: "acrylic",
		vibrancy: "sidebar",
		transparent: true,
		width: 800,
		height: 600,
		webPreferences: { preload: join(__dirname, "../preload/renderer.cjs") },
		show: false,
	});

	// HMR for renderer based on electron-vite cli.
	// Load the remote URL for development or the local html file for production.
	if (app.isPackaged || E2E) {
		void mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
	} else if (process.env["ELECTRON_RENDERER_URL"]) {
		void mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
	} else {
		log.error("No entry point available", {
			isPackaged: app.isPackaged,
			devUrl: process.env["ELECTRON_RENDERER_URL"],
		});
	}

	if (import.meta.env.DEV && !E2E) {
		mainWindow.webContents.openDevTools({ mode: "detach" });
	}

	return mainWindow;
}
