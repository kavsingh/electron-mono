import { Router } from "@solidjs/router";
import { userEvent } from "@testing-library/user-event";

import { AppQueryClientProvider } from "#renderer/contexts/app-query-client";

import type { ParentProps } from "solid-js";

export function setupRenderWrapper() {
	const user = userEvent.setup();

	function Wrapper(props: ParentProps) {
		return (
			<AppQueryClientProvider>
				<Router>{props.children}</Router>
			</AppQueryClientProvider>
		);
	}

	return { user, Wrapper } as const;
}
