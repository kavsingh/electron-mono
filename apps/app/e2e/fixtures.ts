import path from "node:path";

import { _electron, test as baseTest } from "@playwright/test";

import type { ElectronApplication } from "@playwright/test";

interface Fixtures {
	app: ElectronApplication;
}

interface Options {
	appLaunchOptions?:
		| Partial<Parameters<typeof _electron.launch>[0]>
		| undefined;
}

const appPath = path.resolve(import.meta.dirname, "../out/main/index.cjs");

export const test = baseTest.extend<Fixtures & Options>({
	appLaunchOptions: [{}, { option: true }],

	async app({ appLaunchOptions }, use) {
		const { args, ...launchOptions } = appLaunchOptions ?? {};
		const app = await _electron.launch({
			args: [appPath, "--e2e", ...(args ?? [])],
			colorScheme: "dark",
			...launchOptions,
		});

		await use(app);
		await app.close();
	},

	async page({ app }, use) {
		const mainWindow = await app.firstWindow();

		await use(mainWindow);
	},
});

export { expect } from "@playwright/test";
