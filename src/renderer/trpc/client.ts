import { createTRPCProxyClient } from "@trpc/client";
import { ipcLink } from "electron-trpc/renderer";
import SuperJSON from "superjson";

// type only imports stripped at runtime
// eslint-disable-next-line import/no-restricted-paths
import type { AppRouter } from "~/main/trpc/router";

let trpcClient: AppTRPCClient | undefined;

export function getTRPCClient(): AppTRPCClient {
	trpcClient ??= createTRPCProxyClient<AppRouter>({
		links: [ipcLink()],
		transformer: SuperJSON,
	});

	return trpcClient;
}

export type AppTRPCClient = ReturnType<typeof createTRPCProxyClient<AppRouter>>;
