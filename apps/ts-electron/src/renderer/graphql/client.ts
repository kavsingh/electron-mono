import { ApolloClient, InMemoryCache } from "@merged/solid-apollo";
import { createIpcLink } from "graphql-transport-electron";

import bridge from "#renderer/bridge";

import type { ipcRenderer } from "electron";

export function createApolloClient() {
	return new ApolloClient({
		cache: new InMemoryCache(),
		link: createIpcLink({ ipc: bridge.gqlIpc as typeof ipcRenderer }),
	});
}
