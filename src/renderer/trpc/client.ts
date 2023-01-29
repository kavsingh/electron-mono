import { createTRPCProxyClient } from "@trpc/client";
import { ipcLink } from "electron-trpc/renderer";

// type only imports stripped at runtime
// eslint-disable-next-line import/no-restricted-paths
import type { AppRouter } from "~/main/trpc/router";

let trpcClient: AppTRPCClient | undefined;

export const getTRPCClient = (): AppTRPCClient => {
	trpcClient ??= createTRPCProxyClient<AppRouter>({
		links: [ipcLink()],
	});

	return trpcClient;
};

export type AppTRPCClient = ReturnType<typeof createTRPCProxyClient<AppRouter>>;
