import { BrowserWindow, dialog } from "electron";
import { z } from "zod";

import { electronOpenDialogOptionsSchema } from "#common/schema/electron.ts";

import { publicProcedure } from "./trpc-server.ts";

export function routesFiles() {
	return {
		showOpenDialog: publicProcedure
			.input(z.optional(electronOpenDialogOptionsSchema))
			.mutation(({ input = {} }) => {
				// TODO: determine requesting window somehow?
				const focusedWindow = BrowserWindow.getAllWindows().find((win) =>
					win.isFocused(),
				);

				if (!focusedWindow) throw new Error("No focused window");

				return dialog.showOpenDialog(
					focusedWindow,
					// @ts-expect-error upstream exact optionals conflict
					input,
				);
			}),
	} as const;
}
