import { ipcMain } from "electron";
import {
	createSchemaLink,
	createIpcExecutor,
} from "graphql-transport-electron";

import { schema } from "./schema";

export function initGraphQl() {
	const link = createSchemaLink({ schema });

	createIpcExecutor({ link, ipc: ipcMain });
}
