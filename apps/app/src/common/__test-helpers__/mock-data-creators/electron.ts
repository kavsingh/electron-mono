import { mockCreator } from "./mock-creator";

import type { OpenDialogReturnValue } from "electron";

export const createMockOpenDialogReturnValue =
	mockCreator<OpenDialogReturnValue>({ canceled: false, filePaths: [] });
