import { createElectronTypedIpcRenderer } from "electron-typed-ipc/renderer";

import { serializer } from "#common/ipc/serializer";

import type { AppIpcDefinition } from "#common/ipc/schema";

export const ipc = createElectronTypedIpcRenderer<AppIpcDefinition>({
	serializer,
});
