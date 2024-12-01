import { createQuery, useQueryClient } from "@tanstack/solid-query";

import { tipc } from "#renderer/tipc";

// eslint-disable-next-line import-x/no-restricted-paths
import type { SystemStats } from "#main/services/system-stats";
import type { QueryClient } from "@tanstack/solid-query";

export default function useSystemStats() {
	const queryClient = useQueryClient();
	const query = createQuery(() => ({
		queryKey,
		queryFn: () => tipc.getSystemStats.invoke(),
		reconcile: (oldData, newData) => {
			return oldData && BigInt(oldData.sampledAt) >= BigInt(newData.sampledAt)
				? oldData
				: newData;
		},
	}));

	startSubscription(queryClient);

	return query;
}

const queryKey = ["systemStats"];

const startSubscription = (() => {
	let cachedClient: QueryClient;
	let unsubscribe:
		| ReturnType<typeof tipc.systemStatsEvent.subscribe>
		| undefined = undefined;

	return function start(queryClient: QueryClient) {
		if (cachedClient === queryClient) return;

		unsubscribe?.();
		cachedClient = queryClient;

		unsubscribe = tipc.systemStatsEvent.subscribe((_, stats) => {
			const current = cachedClient.getQueryData<SystemStats>(queryKey);
			const shouldUpdate = current
				? BigInt(stats.sampledAt) > BigInt(current.sampledAt)
				: true;

			if (shouldUpdate) {
				cachedClient.setQueryData(queryKey, () => stats);
			}
		});
	};
})();
