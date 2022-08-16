import { mainPublish } from "~/bridge/pubsub";
import { subscribeNtkDaemonStatus } from "~/main/ntk-daemon";

import type { BrowserWindow } from "electron";

export const attachNtkDaemonStatus = (win: BrowserWindow) => {
	let daemonUnsubscribe: () => void;

	const subscribe = () => {
		daemonUnsubscribe = subscribeNtkDaemonStatus((event) => {
			if (event.type !== "message") return;

			const statusEvent = event.message.daemonStatusEvent;

			if (statusEvent) mainPublish(win, "ntkDaemonStatus", statusEvent);
		});
	};

	const unsubscribe = () => {
		daemonUnsubscribe();
	};

	win.on("show", subscribe);
	win.on("restore", subscribe);
	win.on("hide", unsubscribe);
	win.on("close", unsubscribe);

	return () => {
		win.off("show", subscribe);
		win.off("restore", subscribe);
		win.off("hide", unsubscribe);
		win.off("close", unsubscribe);
	};
};
