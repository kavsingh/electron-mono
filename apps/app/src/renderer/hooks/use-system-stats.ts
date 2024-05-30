import { useQuery, useQueryClient } from "@tanstack/react-query";

import { trpc } from "#renderer/trpc";

// eslint-disable-next-line import-x/no-restricted-paths
import type { SystemStats } from "#main/services/system-stats";
import type { QueryClient } from "@tanstack/react-query";

export default function useSystemStats() {
	const queryClient = useQueryClient();
	const query = useQuery({
		queryKey,
		queryFn: () => trpc.systemStats.query(),
	});

	startSubscription(queryClient);

	return query;
}

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
