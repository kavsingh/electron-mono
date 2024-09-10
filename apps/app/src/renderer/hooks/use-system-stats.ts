import { trpc } from "#renderer/trpc";

export default function useSystemStats() {
	const utils = trpc.useUtils();
	const query = trpc.systemStats.useQuery();

	trpc.systemStatsEvent.useSubscription(undefined, {
		onData(event) {
			const current = utils.systemStats.getData();
			const shouldUpdate = current
				? BigInt(event.sampledAt) > BigInt(current.sampledAt)
				: true;

			if (shouldUpdate) {
				utils.systemStats.setData(undefined, () => event);
			}
		},
	});

	return query;
}
