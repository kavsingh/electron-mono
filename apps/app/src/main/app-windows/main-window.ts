import path from "node:path";

import { app, BrowserWindow } from "electron";
import log from "electron-log";

import { APP_RENDERER_URL } from "#main/lib/app-protocol.ts";

export function createMainWindow(isE2E: boolean) {
	const mainWindow = new BrowserWindow({
		titleBarStyle: "hiddenInset",
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.resolve(import.meta.dirname, "../preload/renderer.cjs"),
		},
		show: false,
	});

	function loadRenderer(url: string) {
		return mainWindow.loadURL(url, { userAgent: `App/${app.getVersion()}` });
	}

	// HMR for renderer based on electron-vite cli.
	// Load the remote URL for development or the local html file for production.
	if (app.isPackaged || isE2E) {
		void loadRenderer(APP_RENDERER_URL);
	} else if (process.env["ELECTRON_RENDERER_URL"]) {
		void loadRenderer(process.env["ELECTRON_RENDERER_URL"]);
	} else {
		log.error("No entry point available", {
			isPackaged: app.isPackaged,
			devUrl: process.env["ELECTRON_RENDERER_URL"],
		});
	}

	if (import.meta.env.DEV && !isE2E) {
		mainWindow.webContents.openDevTools({ mode: "detach" });
	}

	return mainWindow;
}
