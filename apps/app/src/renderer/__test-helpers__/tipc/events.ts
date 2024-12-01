import { vi } from "vitest";

import { tipc } from "#renderer/tipc";

// eslint-disable-next-line import-x/no-restricted-paths
import type { SystemStats } from "#main/services/system-stats";

export function publishSystemStatsEvent(payload: SystemStats) {
	publishTipcSubscriberEvent(tipc.systemStatsEvent.subscribe, payload);
}

function publishTipcSubscriberEvent(
	fn: (...args: any[]) => any,
	payload: unknown,
) {
	if (!vi.isMockFunction(fn)) {
		console.warn("Expected a mock function");

		return;
	}

	for (const call of fn.mock.calls) {
		if (!Array.isArray(call)) continue;

		const maybeHandler: unknown = call[0];

		if (typeof maybeHandler === "function") maybeHandler({}, payload);
	}
}
