import { ipcMain } from "electron";

import { createTIPCMain } from "tipc/main";

import type { AppTIPCDefinitions } from "#common/tipc/defintion";

export const tipcMain = createTIPCMain<AppTIPCDefinitions>(ipcMain, {
	serialize: (x) => x,
	deserialize: (x) => x,
});
