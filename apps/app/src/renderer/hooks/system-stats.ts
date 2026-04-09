import { queryOptions, useQuery, useQueryClient } from "@tanstack/solid-query";
import { Unsubscribable } from "@trpc/server/observable";
import { scope } from "electron-log/renderer";

import { SystemStats } from "~/common/schema/system";
import { trpc } from "~/renderer/trpc";

import type { QueryClient } from "@tanstack/solid-query";

function systemStatsQuery() {
	return queryOptions({
		queryKey: ["systemStats"],
		queryFn: () => trpc.systemStats.query(),
		reconcile: (oldData, newData) => {
			return oldData && BigInt(oldData.sampledAt) >= BigInt(newData.sampledAt)
				? oldData
				: newData;
		},
	});
}

const startSubscription = (() => {
	const logger = scope("system stats subscription");
	const queryKey = systemStatsQuery().queryKey;
	let cachedClient: QueryClient;
	let unsubscribable: Unsubscribable | undefined = undefined;

	return function start(queryClient: QueryClient) {
		if (cachedClient === queryClient) return;

		unsubscribable?.unsubscribe();
		cachedClient = queryClient;

		unsubscribable = trpc.systemStatsEvent.subscribe(undefined, {
			onData(event) {
				const current = cachedClient.getQueryData<SystemStats>(queryKey);
				const shouldUpdate = current
					? BigInt(event.sampledAt) >= BigInt(current.sampledAt)
					: true;

				if (shouldUpdate) {
					cachedClient.setQueryData(queryKey, () => event);
				}
			},
			onError(err) {
				logger.error("systemStatsEvent subscription error:", err);
			},
		});
	};
})();

export function useSystemStats() {
	const queryClient = useQueryClient();
	const query = useQuery(systemStatsQuery);

	startSubscription(queryClient);

	return query;
}
