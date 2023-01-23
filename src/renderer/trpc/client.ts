import { createTRPCProxyClient } from "@trpc/client";
// @ts-expect-error fucking ESM interop with package exports, fixing for one breaks 1000 other things, ignore this shit for now.
import { ipcLink } from "electron-trpc/renderer";

// type only imports stripped at runtime
// eslint-disable-next-line import/no-restricted-paths
import type { AppRouter } from "~/main/trpc/router";

let trpcClient: ReturnType<typeof createTRPCProxyClient<AppRouter>> | undefined;

export const getTRPCClient = () => {
	trpcClient ??= createTRPCProxyClient<AppRouter>({
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
		links: [ipcLink()],
	});

	return trpcClient;
};
