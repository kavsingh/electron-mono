import { createTIPCRenderer } from "tipc/renderer";

import type { AppTIPCDefinitions } from "#common/tipc/defintion";

export const tipc = createTIPCRenderer<AppTIPCDefinitions>({
	serialize: (x) => x,
	deserialize: (x) => x,
});
