import { createTIPCRenderer } from "electron-typed-ipc/renderer";

import { serializer } from "#common/tipc/serializer";

import type { AppTIPC } from "#common/tipc/definition";

export const tipc = createTIPCRenderer<AppTIPC>({ serializer });
