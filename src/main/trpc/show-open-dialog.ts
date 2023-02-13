import { BrowserWindow, dialog } from "electron";
import z from "zod";

import { publicProcedure } from "./trpc-server";

// From electron.OpenDialogOptions

const fileFilter = z.object({
	extensions: z.array(z.string()),
	name: z.string(),
});

const openDialogOptions = z.object({
	title: z.optional(z.string()),
	defaultPath: z.optional(z.string()),
	buttonLabel: z.optional(z.string()),
	filters: z.optional(z.array(fileFilter)),
	properties: z.optional(
		z.array(
			z.union([
				z.literal("openFile"),
				z.literal("openDirectory"),
				z.literal("multiSelections"),
				z.literal("showHiddenFiles"),
				z.literal("createDirectory"),
				z.literal("promptToCreate"),
				z.literal("noResolveAliases"),
				z.literal("treatPackageAsDirectory"),
				z.literal("dontAddToRecent"),
			]),
		),
	),
	message: z.optional(z.string()),
	securityScopedBookmarks: z.optional(z.boolean()),
});

//

const showOpenDialog = publicProcedure
	.input(openDialogOptions)
	.query(({ input }) => {
		// TODO: determine which window made the request
		const targetWindow = BrowserWindow.getAllWindows()[0];

		if (!targetWindow) throw new Error("No active browser window");

		return dialog.showOpenDialog(
			targetWindow,
			// get around exactOptionalPropertyTypes
			input as StripUndefined<typeof input>,
		);
	});

export default showOpenDialog;
