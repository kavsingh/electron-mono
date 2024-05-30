import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import type { PropsWithChildren } from "react";

export function AppQueryClientProvider(props: PropsWithChildren) {
	return (
		<QueryClientProvider client={new QueryClient()}>
			{props.children}
		</QueryClientProvider>
	);
}
