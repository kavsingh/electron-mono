import { trpc } from "#renderer/trpc";

// eslint-disable-next-line import/no-restricted-paths
import type { SystemInfo } from "#main/services/system-info";
import type { Mock } from "vitest";

export function publishSystemInfoEvent(payload: SystemInfo) {
	publishTrpcSubscriberEvent(trpc.systemInfoEvent.subscribe, payload);
}

function publishTrpcSubscriberEvent<TFunc extends (...args: any[]) => any>(
	mockedTrpcSubscribe: TFunc,
	payload: unknown,
) {
	const calls: unknown[] = (mockedTrpcSubscribe as unknown as Mock).mock.calls;

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
