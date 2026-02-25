import { mockCreator } from "./mock-creator.ts";

import type { OpenDialogReturnValue } from "electron";

export const createMockOpenDialogReturnValue =
	mockCreator<OpenDialogReturnValue>({ canceled: false, filePaths: [] });
