import { observable } from "@trpc/server/observable";
import { BrowserWindow, dialog } from "electron";

import { electronOpenDialogOptionsSchema } from "~/common/schema/electron";

import { publicProcedure, router } from "./trpc-server";
import { heartbeatEmitter } from "../services/heartbeat";
import { getSystemInfo } from "../services/system-info";

import type { HeartbeatEventMap } from "../services/heartbeat";

export const appRouter = router({
	systemInfo: publicProcedure.query(() => getSystemInfo()),
	heartbeat: publicProcedure.subscription(() =>
		observable<HeartbeatPayload>((emit) => {
			const handler: HeartbeatHandler = (payload) => {
				emit.next(payload);
			};

			heartbeatEmitter.on("heartbeat", handler);

			return function unsubscribe() {
				heartbeatEmitter.off("heartbeat", handler);
			};
		}),
	),
	showOpenDialog: publicProcedure
		.input(electronOpenDialogOptionsSchema)
		.query(({ input }) => {
			// TODO: determine requesting window somehow?
			const focusedWindow = BrowserWindow.getAllWindows().find((win) =>
				win.isFocused(),
			);

			if (!focusedWindow) throw new Error("No focused window");

			return dialog.showOpenDialog(
				focusedWindow,
				// circumvent exactOptionalPropertyTypes conflict with
				// upstream types
				input as StripUndefined<typeof input>,
			);
		}),
});

export type AppRouter = typeof appRouter;

type HeartbeatHandler = HeartbeatEventMap["heartbeat"];
type HeartbeatPayload = Parameters<HeartbeatHandler>[0];
