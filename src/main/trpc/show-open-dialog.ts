import { BrowserWindow, dialog } from "electron";
import z from "zod";

import { publicProcedure } from "./trpc-server";

// From electron.OpenDialogOptions

const fileFilter = z.object({
	extensions: z.array(z.string()),
	name: z.string(),
});

const property = z.union([
	z.literal("openFile"),
	z.literal("openDirectory"),
	z.literal("multiSelections"),
	z.literal("showHiddenFiles"),
	z.literal("createDirectory"),
	z.literal("promptToCreate"),
	z.literal("noResolveAliases"),
	z.literal("treatPackageAsDirectory"),
	z.literal("dontAddToRecent"),
]);

const openDialogOptions = z.object({
	title: z.ostring(),
	defaultPath: z.ostring(),
	buttonLabel: z.ostring(),
	filters: z.optional(z.array(fileFilter)),
	properties: z.optional(z.array(property)),
	message: z.ostring(),
	securityScopedBookmarks: z.oboolean(),
});

//

const showOpenDialog = publicProcedure
	.input(openDialogOptions)
	.query(({ input }) => {
		// TODO: determine requesting window somehow?
		const focusedWindow = BrowserWindow.getAllWindows().find((win) =>
			win.isFocused(),
		);

		if (!focusedWindow) throw new Error("No focused window");

		return dialog.showOpenDialog(
			focusedWindow,
			// get around exactOptionalPropertyTypes
			input as StripUndefined<typeof input>,
		);
	});

export default showOpenDialog;
