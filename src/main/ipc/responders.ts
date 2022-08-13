import { mainResponder } from "~/bridge/request";

// import { getSystemInfo } from "../lib/system-info";

export const setupResponders = () => {
	const removeSystemInfoResponder = mainResponder("getSystemInfo", () => {
		throw new ErrorWithCode("ERROR", 5);
		// return getSystemInfo();
	});

	return () => {
		removeSystemInfoResponder();
	};
};

class ErrorWithCode extends Error {
	override name = "ErrorWithCode";
	code: number;

	constructor(message: string, code: number) {
		super(message);
		this.code = code;
	}
}
