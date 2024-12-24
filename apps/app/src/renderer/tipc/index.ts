import { createTIPCRenderer } from "tipc/renderer";

import { serializer } from "#common/tipc/serializer-json";

import type { AppTIPC } from "#common/tipc/definition";

export const tipc = createTIPCRenderer<AppTIPC>({ serializer });
