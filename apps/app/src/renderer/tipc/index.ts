import { createTIPCRenderer } from "tipc/renderer";

import { serializer } from "#common/tipc/serializer-json";

import type { AppTIPC } from "#common/tipc/defintion";

export const tipc = createTIPCRenderer<AppTIPC>({ serializer });
