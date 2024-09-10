import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ipcLink } from "electron-trpc/renderer";
import { SuperJSON } from "superjson";

import { trpc } from "#renderer/trpc";

import type { PropsWithChildren } from "react";

export function AppQueryClientProvider(props: PropsWithChildren) {
	const queryClient = new QueryClient();
	const trpcClient = trpc.createClient({
		links: [ipcLink()],
		transformer: SuperJSON,
	});

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				{props.children}
			</QueryClientProvider>
		</trpc.Provider>
	);
}
