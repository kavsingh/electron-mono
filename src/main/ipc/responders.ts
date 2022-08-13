import { mainResponder } from "~/bridge/request";

import { getSystemInfo } from "../lib/system-info";

export const setupResponders = () => {
	const removeSystemInfoResponder = mainResponder(
		"getSystemInfo",
		getSystemInfo,
	);

	return () => {
		removeSystemInfoResponder();
	};
};
