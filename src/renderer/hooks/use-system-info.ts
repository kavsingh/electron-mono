import { createQuery, useQueryClient } from "@tanstack/solid-query";
import { onCleanup } from "solid-js";

import { useTRPCClient } from "~/renderer/contexts/trpc-client";

export default function useSystemInfo() {
	const client = useTRPCClient();
	const queryClient = useQueryClient();

	const query = createQuery(() => ({
		queryKey: ["systemInfo"],
		queryFn: () => client.systemInfo.query(),
	}));

	const subscription = client.systemInfoEvent.subscribe(undefined, {
		onData(data) {
			queryClient.setQueryData(["systemInfo"], () => data);
		},
	});

	onCleanup(() => {
		subscription.unsubscribe();
	});

	return query;
}
