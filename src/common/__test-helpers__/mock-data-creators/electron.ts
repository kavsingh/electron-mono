import type { OpenDialogReturnValue } from "electron";

export function createMockOpenDialogReturnValue(
	value: Partial<OpenDialogReturnValue> = {},
): OpenDialogReturnValue {
	return {
		canceled: false,
		filePaths: [],
		...value,
	};
}
