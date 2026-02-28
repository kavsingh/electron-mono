import { useQuery, useQueryClient } from "@tanstack/solid-query";

import { SystemStats } from "#common/schema/system";
import { trpc } from "#renderer/trpc";

import type { QueryClient } from "@tanstack/solid-query";

const queryKey = ["systemStats"];

const startSubscription = (() => {
	let cachedClient: QueryClient;
	let unsubscribable:
		| Awaited<ReturnType<typeof trpc.systemStatsEvent.subscribe>>
		| undefined = undefined;

	return function start(queryClient: QueryClient) {
		if (cachedClient === queryClient) return;

		unsubscribable?.unsubscribe();
		cachedClient = queryClient;

		unsubscribable = trpc.systemStatsEvent.subscribe(undefined, {
			onData(event) {
				const current = cachedClient.getQueryData<SystemStats>(queryKey);
				const shouldUpdate = current
					? BigInt(event.sampledAt) > BigInt(current.sampledAt)
					: true;

				if (shouldUpdate) {
					cachedClient.setQueryData(queryKey, () => event);
				}
			},
		});
	};
})();

export function useSystemStats() {
	const queryClient = useQueryClient();
	const query = useQuery(() => ({
		queryKey,
		queryFn: () => trpc.systemStats.query(),
		reconcile: (oldData, newData) => {
			return oldData && BigInt(oldData.sampledAt) >= BigInt(newData.sampledAt)
				? oldData
				: newData;
		},
	}));

	startSubscription(queryClient);

	return query;
}
