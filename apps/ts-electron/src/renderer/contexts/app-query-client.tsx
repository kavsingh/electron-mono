import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";

import type { ParentProps } from "solid-js";

const queryClient = new QueryClient();

export function AppQueryClientProvider(props: ParentProps) {
	return (
		<QueryClientProvider client={queryClient}>
			{props.children}
		</QueryClientProvider>
	);
}
