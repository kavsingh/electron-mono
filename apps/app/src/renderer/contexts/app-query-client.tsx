import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";

import type { ParentProps } from "solid-js";

export function AppQueryClientProvider(props: ParentProps) {
	return (
		<QueryClientProvider client={new QueryClient()}>
			{props.children}
		</QueryClientProvider>
	);
}
