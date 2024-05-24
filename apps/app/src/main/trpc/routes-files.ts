import { BrowserWindow, dialog } from "electron";
import { z } from "zod";

import { electronOpenDialogOptionsSchema } from "#common/schema/electron";

import { publicProcedure } from "./trpc-server";

export default function routesFiles() {
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
					// circumvent exactOptionalPropertyTypes conflict with
					// upstream types
					input as StripUndefined<typeof input>,
				);
			}),
	} as const;
}
