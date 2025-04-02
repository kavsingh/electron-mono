import { createElectronTypedIpcRenderer } from "@kavsingh/electron-typed-ipc/renderer";

import { serializer } from "#common/ipc/serializer";

import type { AppIpcSchema } from "#common/ipc/schema";

export const ipc = createElectronTypedIpcRenderer<AppIpcSchema>({ serializer });
