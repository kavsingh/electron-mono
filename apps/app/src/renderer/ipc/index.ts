import { createTypedIpcRenderer } from "electron-typed-ipc/renderer";

import { serializer } from "#common/ipc/serializer";

import type { AppIpcDefinition } from "#common/ipc/definition";

export const ipc = createTypedIpcRenderer<AppIpcDefinition>({ serializer });
