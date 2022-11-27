import { measuredAsyncFn } from "~/common/measure";
import { normalizeNtkDaemonResponse } from "~/common/ntk-daemon/response";
import bridge from "~/renderer/bridge";

export const fetchDaemonVersion = measuredAsyncFn("fetchDaemonVersion", () =>
	normalizeNtkDaemonResponse(bridge.getNtkDaemonVersion()),
);

export const fetchKnownProducts = measuredAsyncFn(
	"fetchKnownProducts",
	async () => {
		const response = await normalizeNtkDaemonResponse(
			bridge.getNtkDaemonKnownProducts(),
		);

		return response.knownProducts;
	},
);
