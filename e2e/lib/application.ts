import os from "os";
import path from "path";

import { _electron as electron } from "@playwright/test";

import { PROJECT_ROOT } from "./constants";

import type { ElectronApplication } from "@playwright/test";

export const setupApplication = async (): Promise<ElectronApplication> =>
	electron.launch({
		args: [path.join(PROJECT_ROOT, "out/main/index.js")],
		env: {
			...(os.platform() === "win32"
				? {
						CommonProgramFiles: "C:\\Program Files\\Common Files",
						Public: "C:\\Users\\Public",
				  }
				: {}),
		},
	});

export const teardownApplication = async (
	app: ElectronApplication,
): Promise<void> => app.close();
