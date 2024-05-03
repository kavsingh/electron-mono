import { join } from "node:path";

import { BrowserView, BrowserWindow } from "electron";
import { z } from "zod";

import { publicProcedure } from "./trpc-server";

import type { BrowserViewConstructorOptions, Rectangle } from "electron";

const SHOW_DEVTOOLS = import.meta.env.DEV && !E2E;

export default function routesViews() {
	return {
		showEmbeddedWebView: publicProcedure
			.input(showEmbeddedWebViewInputSchema)
			.mutation(({ input }) => {
				const targetWindow = BrowserWindow.getFocusedWindow();

				if (!targetWindow) throw new Error("No focused window found");

				const view = new BrowserView({
					...input.browserViewOptions,
					webPreferences: {
						devTools: SHOW_DEVTOOLS,
						preload: join(__dirname, "../preload/web.cjs"),
						...input.browserViewOptions?.webPreferences,
					},
				});

				targetWindow.addBrowserView(view);
				view.setBounds(input.bounds);
				void view.webContents.loadURL(input.url);

				if (SHOW_DEVTOOLS) view.webContents.openDevTools({ mode: "detach" });

				return view.webContents.id;
			}),

		updateEmbeddedWebView: publicProcedure
			.input(updateEmbeddedWebViewInputSchema)
			.mutation(({ input }) => {
				const [view] = getBrowserView(input.viewId) ?? [];

				view?.setBounds(input.bounds);
			}),

		removeEmbeddedWebView: publicProcedure
			.input(z.number())
			.mutation(({ input }) => {
				const [view, win] = getBrowserView(input) ?? [];

				if (!view) return;

				view.webContents.close();
				view.webContents.closeDevTools();
				win?.removeBrowserView(view);
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

export const showEmbeddedWebViewInputSchema = z.object({
	url: z.string(),
	bounds: boundsSchema,
	browserViewOptions: z.custom<BrowserViewConstructorOptions>().optional(),
});

export const updateEmbeddedWebViewInputSchema = z.object({
	viewId: z.number(),
	bounds: boundsSchema,
});

export type ShowEmbeddedWebViewInput = z.infer<
	typeof showEmbeddedWebViewInputSchema
>;

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
