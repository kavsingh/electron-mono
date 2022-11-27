import { normalizeNtkDaemonResponse } from "~/common/ntk-daemon/response";
import bridge from "~/renderer/bridge";

export const fetchDaemonVersion = () =>
	normalizeNtkDaemonResponse(bridge.getNtkDaemonVersion());

export const fetchKnownProducts = () =>
	normalizeNtkDaemonResponse(bridge.getNtkDaemonKnownProducts()).then(
		({ knownProducts }) => knownProducts,
	);
