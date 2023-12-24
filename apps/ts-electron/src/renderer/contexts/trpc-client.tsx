import { createContext, useContext } from "solid-js";

import type { AppTRPCClient } from "#renderer/trpc/client";
import type { ParentProps } from "solid-js";

export function TRPCClientProvider(
	props: ParentProps<{ client: AppTRPCClient }>,
) {
	return (
		// eslint-disable-next-line solid/reactivity
		<TRPCClientContext.Provider value={props.client}>
			{props.children}
		</TRPCClientContext.Provider>
	);
}

export function useTRPCClient() {
	const value = useContext(TRPCClientContext);

	if (!value) {
		throw new Error("useTRPCClient must be used within a TRPCClientProvider");
	}

	return value;
}

const TRPCClientContext = createContext<AppTRPCClient | undefined>();
