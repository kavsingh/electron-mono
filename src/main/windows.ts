import { BrowserWindow } from "electron";

export const createMainWindow = () => {
	const mainWindow = new BrowserWindow({
		height: 600,
		width: 800,
		titleBarStyle: "hiddenInset",
		webPreferences: { preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY },
	});

	void mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

	if (process.env.NODE_ENV === "development") {
		mainWindow.webContents.openDevTools();
	}

	return mainWindow;
};
