import { observable } from "@trpc/server/observable";
import { BrowserWindow, dialog, nativeTheme } from "electron";

import { themeSourceSchema } from "~/common/lib/theme";
import { electronOpenDialogOptionsSchema } from "~/common/schema/electron";
import { getSystemInfo } from "~/main/services/system-info";

import { publicProcedure, router } from "./trpc-server";

import type { ThemeSource } from "~/common/lib/theme";
import type { AppEvent, AppEventBus } from "~/main/services/app-event-bus";

export function createAppRouter(eventBus: AppEventBus) {
	return router({
		systemInfo: publicProcedure.query(() => getSystemInfo()),

		heartbeat: publicProcedure.subscription(() => {
			type Payload = AppEvent<"app/heartbeatEvent">;

			return observable<Payload>((emit) => {
				function handler(payload: Payload) {
					emit.next(payload);
				}

				eventBus.on("app/heartbeatEvent", handler);

				return function unsubscribe() {
					eventBus.off("app/heartbeatEvent", handler);
				};
			});
		}),

		themeSource: publicProcedure.query(
			(): ThemeSource => nativeTheme.themeSource,
		),

		setThemeSource: publicProcedure
			.input(themeSourceSchema)
			.mutation(({ input }) => {
				nativeTheme.themeSource = input;
			}),

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
}

export type AppRouter = ReturnType<typeof createAppRouter>;
