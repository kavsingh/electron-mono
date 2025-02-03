import { BrowserWindow, dialog } from "electron";

import { electronOpenDialogOptionsSchema } from "#common/schema/electron";

import { publicProcedure } from "./trpc-server";

export default function routesFiles() {
	return {
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
					// @ts-expect-error upstream exact optionals conflict
					input,
				);
			}),
	} as const;
}
