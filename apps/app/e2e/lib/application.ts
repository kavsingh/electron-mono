import os from "node:os";
import path from "node:path";

import { _electron as electron } from "@playwright/test";

import { PROJECT_ROOT } from "./constants.ts";

import type { ElectronApplication } from "@playwright/test";

export function setupApplication() {
	return electron.launch({
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
}

export function teardownApplication(app: ElectronApplication) {
	return app.close();
}
