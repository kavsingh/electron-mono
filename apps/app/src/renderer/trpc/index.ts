import { createTRPCProxyClient } from "@trpc/client";
import { ipcLink } from "electron-trpc/renderer";
import { SuperJSON } from "superjson";

// eslint-disable-next-line import-x/no-restricted-paths
import type { AppRouter } from "#main/trpc/router";

export const trpc = createTRPCProxyClient<AppRouter>({
	links: [ipcLink()],
	transformer: SuperJSON,
});
