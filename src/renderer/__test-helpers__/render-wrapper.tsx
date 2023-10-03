import { Router } from "@solidjs/router";
import { userEvent } from "@testing-library/user-event";

import { TRPCClientProvider } from "~/renderer/contexts/trpc-client";
import { getTRPCClient } from "~/renderer/trpc/client";

import type { ParentProps } from "solid-js";

export function setupRenderWrapper() {
	const trpcClient = getTRPCClient();
	// TODO: upstream bug, see: https://github.com/testing-library/eslint-plugin-testing-library/issues/818
	// eslint-disable-next-line testing-library/await-async-events
	const user = userEvent.setup();

	function Wrapper(props: ParentProps) {
		return (
			<TRPCClientProvider client={trpcClient}>
				<Router>{props.children}</Router>
			</TRPCClientProvider>
		);
	}

	return { user, trpcClient, Wrapper };
}
