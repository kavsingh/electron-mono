import { createTIPCRenderer } from "tipc/renderer";

import type { AppTIPC } from "#common/tipc/defintion";

export const tipc = createTIPCRenderer<AppTIPC>();
