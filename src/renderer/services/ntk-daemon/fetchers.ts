import { measuredAsyncFn } from "~/common/measure";
import { normalizeNtkDaemonResponse } from "~/common/ntk-daemon/response";
import bridge from "~/renderer/bridge";

export const fetchDaemonVersion = measuredAsyncFn("fetchDaemonVersion", () =>
	normalizeNtkDaemonResponse(bridge.getNtkDaemonVersion()),
);

export const fetchKnownProducts = measuredAsyncFn("fetchKnownProducts", () =>
	normalizeNtkDaemonResponse(bridge.getNtkDaemonKnownProducts()).then(
		({ knownProducts }) => knownProducts,
	),
);
