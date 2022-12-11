import { join } from "path";

import { app, BrowserWindow } from "electron";

import { error } from "~/common/log";

export const createMainWindow = () => {
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

	// for some reason import.meta.env.DEV is false despite MODE development
	// TODO: keep eye out for a fix
	if (import.meta.env.MODE === "development" && !E2E) {
		mainWindow.webContents.openDevTools();
	}

	return mainWindow;
};
