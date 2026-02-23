import { shell } from "electron";
import log from "electron-log";

import type { WebContents } from "electron";

const allowedHosts = new Set<string>();

function isAllowedHost(url: string) {
	const host = URL.parse(url)?.host;

	return host ? allowedHosts.has(host) : false;
}

export function restrictNavigation(contents: WebContents) {
	// https://www.electronjs.org/docs/latest/tutorial/security#13-disable-or-limit-navigation
	contents.on("will-navigate", (event, url) => {
		log.warn(`Blocked navigation attempt to ${url}`);
		event.preventDefault();
	});

	// https://www.electronjs.org/docs/latest/tutorial/security#14-disable-or-limit-creation-of-new-windows
	contents.setWindowOpenHandler(({ url }) => {
		if (isAllowedHost(url)) {
			log.info(`Opening url in browser: ${url}`);
			setImmediate(() => void shell.openExternal(url));
		} else {
			log.warn(`Blocked attempt to open ${url}`);
		}

		return { action: "deny" };
	});
}
