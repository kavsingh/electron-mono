import { mainResponder } from "~/bridge/request";
import { getSystemInfo } from "~/main/services/system-info";

import { getNtkDaemonVersion } from "../ntk-daemon";

export const setupResponders = () => {
	const removeSystemInfoResponder = mainResponder(
		"getSystemInfo",
		getSystemInfo,
	);
	const removeGetNtkDaemonVersionResponder = mainResponder(
		"getNtkDaemonVersion",
		() => getNtkDaemonVersion(),
	);

	return () => {
		removeSystemInfoResponder();
		removeGetNtkDaemonVersionResponder();
	};
};
