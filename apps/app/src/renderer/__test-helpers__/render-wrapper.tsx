import { userEvent } from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import { AppQueryClientProvider } from "#renderer/contexts/app-query-client";

import type { PropsWithChildren } from "react";

export function setupRenderWrapper() {
	const user = userEvent.setup();

	function Wrapper(props: PropsWithChildren) {
		return (
			<AppQueryClientProvider>
				<MemoryRouter>
					<Routes>
						<Route path="/" element={props.children} />
					</Routes>
				</MemoryRouter>
			</AppQueryClientProvider>
		);
	}

	return { user, Wrapper } as const;
}
