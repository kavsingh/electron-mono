import { tipc } from "#renderer/tipc";

// eslint-disable-next-line import-x/no-restricted-paths
import type { SystemStats } from "#main/services/system-stats";
import type { Mock } from "vitest";

export function publishSystemStatsEvent(payload: SystemStats) {
	publishTipcSubscriberEvent(tipc.subscribe.systemStatsEvent as Mock, payload);
}

function publishTipcSubscriberEvent(
	mockedTipcSubscribe: Mock,
	payload: unknown,
) {
	const calls: unknown[] = mockedTipcSubscribe.mock.calls;

	for (const call of calls) {
		if (!Array.isArray(call)) continue;

		const maybeHandler: unknown = call[1];

		if (typeof maybeHandler === "function") maybeHandler(payload);
	}
}
