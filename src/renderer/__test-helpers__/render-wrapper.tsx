import { Router } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { userEvent } from "@testing-library/user-event";

import { TRPCClientProvider } from "~/renderer/contexts/trpc-client";
import { getTRPCClient } from "~/renderer/trpc/client";

import type { ParentProps } from "solid-js";

export function setupRenderWrapper() {
	const trpcClient = getTRPCClient();
	const queryClient = new QueryClient();
	// TODO: upstream bug, see: https://github.com/testing-library/eslint-plugin-testing-library/issues/818
	// eslint-disable-next-line testing-library/await-async-events
	const user = userEvent.setup();

	function Wrapper(props: ParentProps) {
		return (
			<TRPCClientProvider client={trpcClient}>
				<QueryClientProvider client={queryClient}>
					<Router>{props.children}</Router>
				</QueryClientProvider>
			</TRPCClientProvider>
		);
	}

	return { user, trpcClient, queryClient, Wrapper } as const;
}
