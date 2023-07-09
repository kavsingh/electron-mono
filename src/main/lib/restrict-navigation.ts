import { shell } from "electron";

import { logWarn } from "~/common/log";

import type { WebContents } from "electron";

export default function restrictNavigation(contents: WebContents) {
	// https://www.electronjs.org/docs/latest/tutorial/security#13-disable-or-limit-navigation
	contents.on("will-navigate", (event, url) => {
		logWarn(`Blocked navigation attempt to ${url}`);
		event.preventDefault();
	});

	// https://www.electronjs.org/docs/latest/tutorial/security#14-disable-or-limit-creation-of-new-windows
	contents.setWindowOpenHandler(({ url }) => {
		if (isAllowedHost(url)) {
			setImmediate(() => void shell.openExternal(url));
		} else {
			logWarn(`Blocked attempt to open ${url}`);
		}

		return { action: "deny" };
	});
}

const allowedHosts: string[] = [];

function isAllowedHost(url: string) {
	return allowedHosts.includes(new URL(url).host);
}
