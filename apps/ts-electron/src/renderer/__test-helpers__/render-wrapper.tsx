import { ApolloProvider } from "@merged/solid-apollo";
import { MemoryRouter, Route } from "@solidjs/router";
import { userEvent } from "@testing-library/user-event";

import { createApolloClient } from "#renderer/graphql/client";

import type { ParentProps } from "solid-js";

export function setupRenderWrapper() {
	const apolloClient = createApolloClient();
	const user = userEvent.setup();

	function Wrapper(props: ParentProps) {
		return (
			<ApolloProvider client={apolloClient}>
				<MemoryRouter>
					<Route path="/" component={() => props.children} />
				</MemoryRouter>
			</ApolloProvider>
		);
	}

	return { user, apolloClient, Wrapper } as const;
}
