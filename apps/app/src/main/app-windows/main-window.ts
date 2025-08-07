import { app, BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

import log from "electron-log";

import { APP_RENDERER_URL } from "#main/lib/app-protocol";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export function createMainWindow() {
	const mainWindow = new BrowserWindow({
		titleBarStyle: "hiddenInset",
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.resolve(dirname, "../preload/renderer.cjs"),
		},
		show: false,
	});

	// HMR for renderer based on electron-vite cli.
	// Load the remote URL for development or the local html file for production.
	if (app.isPackaged || E2E) {
		void mainWindow.loadURL(APP_RENDERER_URL);
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
