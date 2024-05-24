import { createQuery, useQueryClient } from "@tanstack/solid-query";
import { onCleanup } from "solid-js";

import { trpc } from "#renderer/trpc";

export default function useSystemInfo() {
	const queryClient = useQueryClient();

	const query = createQuery(() => ({
		queryKey: ["systemInfo"],
		queryFn: () => trpc.systemInfo.query(),
	}));

	const subscription = trpc.systemInfoEvent.subscribe(undefined, {
		onData(data) {
			queryClient.setQueryData(["systemInfo"], () => data);
		},
	});

	onCleanup(() => {
		subscription.unsubscribe();
	});

	return query;
}
