import { createTRPCClient } from "@trpc/client";
import { SuperJSON } from "superjson";
import { ipcLink } from "trpc-electron/renderer";

// eslint-disable-next-line import-x/no-restricted-paths
import type { AppRouter } from "#main/trpc/router";

export const trpc = createTRPCClient<AppRouter>({
	links: [ipcLink({ transformer: SuperJSON })],
});
