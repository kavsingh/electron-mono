import { mainResponder } from "~/bridge/request";
import { getSystemInfo } from "~/main/services/system-info";

export const setupResponders = () => {
	const removeSystemInfoResponder = mainResponder(
		"getSystemInfo",
		getSystemInfo,
	);

	return () => {
		removeSystemInfoResponder();
	};
};
