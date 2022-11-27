import { mainPublish } from "~/bridge/pubsub";
import { getSystemInfo } from "~/main/services/system-info";

import type { BrowserWindow } from "electron";

export const attachSystemInfo = (win: BrowserWindow) => {
	let stopSystemInfo: ReturnType<typeof startSystemInfo> | undefined;

	const start = () => {
		stopSystemInfo?.();
		stopSystemInfo = startSystemInfo(win);
	};

	const stop = () => {
		stopSystemInfo?.();
	};

	win.on("show", start);
	win.on("restore", start);
	win.on("hide", stop);
	win.on("close", stop);

	return () => {
		stopSystemInfo?.();
		win.off("show", start);
		win.off("restore", start);
		win.off("hide", stop);
		win.off("close", stop);
	};
};

const startSystemInfo = (win: BrowserWindow) => {
	let timeout: NodeJS.Timeout | null = null;

	const tick = async () => {
		if (timeout) clearTimeout(timeout);

		if (!win.isVisible()) return;

		const info = await getSystemInfo();

		mainPublish(win, "systemInfo", info);

		timeout = setTimeout(() => void tick(), 2000);
	};

	void tick();

	return () => {
		if (timeout) clearTimeout(timeout);
	};
};
