import { vi } from "vitest";

import { trpc } from "#renderer/trpc";

import type { SystemStats } from "#main/services/system-stats";
import type { Mock } from "vitest";

function publishTrpcSubscriberEvent(
	mockedTrpcSubscribe: Mock,
	payload: unknown,
) {
	const calls: unknown[] = mockedTrpcSubscribe.mock.calls;

	for (const call of calls) {
		if (!Array.isArray(call)) continue;

		const maybeOptions: unknown = call[1];

		if (
			maybeOptions &&
			typeof maybeOptions === "object" &&
			"onData" in maybeOptions &&
			typeof maybeOptions.onData === "function"
		) {
			maybeOptions.onData(payload);
		}
	}
}

export function publishSystemStatsEvent(payload: SystemStats) {
	publishTrpcSubscriberEvent(
		vi.mocked(trpc.systemStatsEvent.subscribe),
		payload,
	);
}
