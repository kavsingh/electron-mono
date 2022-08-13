import { mainResponder } from "~/bridge/request";
import { serializeNtkDaemonResponse } from "~/common/ntk-daemon/serialization";
import { getSystemInfo } from "~/main/services/system-info";

import { getNtkDaemonVersion } from "../ntk-daemon";

export const setupResponders = () => {
	const removeSystemInfoResponder = mainResponder(
		"getSystemInfo",
		getSystemInfo,
	);
	const removeGetNtkDaemonVersionResponder = mainResponder(
		"getNtkDaemonVersion",
		() => serializeNtkDaemonResponse(getNtkDaemonVersion()),
	);

	return () => {
		removeSystemInfoResponder();
		removeGetNtkDaemonVersionResponder();
	};
};
