import { BrowserView, BrowserWindow } from "electron";
import { z } from "zod";

import { publicProcedure } from "./trpc-server";

import type { BrowserViewConstructorOptions, Rectangle } from "electron";

export default function routesViews() {
	return {
		showBrowserView: publicProcedure
			.input(showBrowserViewSchema)
			.mutation(({ input }) => {
				const view = new BrowserView(input.browserViewOptions);
				const focusedWindow = BrowserWindow.getFocusedWindow();
				const viewId = view.webContents.id;

				focusedWindow?.addBrowserView(view);
				view.setBounds(input.bounds);
				void view.webContents.loadURL(input.url);

				return viewId;
			}),

		updateBrowserView: publicProcedure
			.input(updateBrowserViewSchema)
			.mutation(({ input }) => {
				const [view] = getBrowserView(input.viewId) ?? [];

				view?.setBounds(input.bounds);
			}),

		removeBrowserView: publicProcedure
			.input(z.number())
			.mutation(({ input }) => {
				const [view, win] = getBrowserView(input) ?? [];

				if (view) win?.removeBrowserView(view);
			}),
	} as const;
}

const zRectSchema = z.object({
	x: z.number(),
	y: z.number(),
	width: z.number(),
	height: z.number(),
});

const boundsSchema = z.custom<Rectangle>((input) => zRectSchema.parse(input));

export const showBrowserViewSchema = z.object({
	url: z.string(),
	bounds: boundsSchema,
	browserViewOptions: z.custom<BrowserViewConstructorOptions>().optional(),
});

export const updateBrowserViewSchema = z.object({
	viewId: z.number(),
	bounds: boundsSchema,
});

export type ShowBrowserViewInput = z.infer<typeof showBrowserViewSchema>;

function getBrowserView(
	viewId: number,
): [view: BrowserView, window: BrowserWindow] | undefined {
	for (const win of BrowserWindow.getAllWindows()) {
		for (const view of win.getBrowserViews()) {
			if (view.webContents.id === viewId) {
				return [view, win];
			}
		}
	}

	return undefined;
}
