import path from "node:path";

import { _electron, test as baseTest } from "@playwright/test";

import type { ElectronApplication } from "@playwright/test";

interface Fixtures {
	app: ElectronApplication;
}

const appPath = path.resolve(import.meta.dirname, "../../out/main/index.js");

export const test = baseTest.extend<Fixtures>({
	async app({ launchOptions: _ }, use) {
		const app = await _electron.launch({ args: [path.join(appPath)] });

		await use(app);
		await app.close();
	},

	async page({ app }, use) {
		const mainWindow = await app.firstWindow();

		await use(mainWindow);
	},
});

export { expect } from "@playwright/test";
