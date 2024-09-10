import { BrowserWindow, WebContentsView } from "electron";
import { join } from "node:path";

import { z } from "zod";

import { publicProcedure } from "./trpc-server";

import type {
	Rectangle,
	View,
	WebContentsViewConstructorOptions,
} from "electron";

const SHOW_DEVTOOLS = import.meta.env.DEV && !E2E;

export default function routesViews() {
	return {
		showEmbeddedWebView: publicProcedure
			.input(showEmbeddedWebViewInputSchema)
			.mutation(({ input }) => {
				const targetWindow = BrowserWindow.getFocusedWindow();

				if (!targetWindow) throw new Error("No focused window found");

				const view = new WebContentsView({
					...input.webContentsViewOptions,
					webPreferences: {
						devTools: SHOW_DEVTOOLS,
						preload: join(__dirname, "../preload/web.cjs"),
						...input.webContentsViewOptions?.webPreferences,
					},
				});

				targetWindow.contentView.addChildView(view);
				view.setBounds(input.bounds);
				void view.webContents.loadURL(input.url);

				if (SHOW_DEVTOOLS) view.webContents.openDevTools({ mode: "detach" });

				return view.webContents.id;
			}),

		updateEmbeddedWebView: publicProcedure
			.input(updateEmbeddedWebViewInputSchema)
			.mutation(({ input }) => {
				const [view] = getWebContentsView(input.viewId) ?? [];

				view?.setBounds(input.bounds);
			}),

		removeEmbeddedWebView: publicProcedure
			.input(z.number())
			.mutation(({ input }) => {
				const [view, contentView] = getWebContentsView(input) ?? [];

				if (!view) return;

				view.webContents.close();
				view.webContents.closeDevTools();
				contentView?.removeChildView(view);
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
	webContentsViewOptions: z
		.custom<WebContentsViewConstructorOptions>()
		.optional(),
});

export const updateEmbeddedWebViewInputSchema = z.object({
	viewId: z.number(),
	bounds: boundsSchema,
});

export type ShowEmbeddedWebViewInput = z.infer<
	typeof showEmbeddedWebViewInputSchema
>;

function getWebContentsView(
	viewId: number,
): [view: WebContentsView, container: View] | undefined {
	for (const win of BrowserWindow.getAllWindows()) {
		const container = win.contentView;

		for (const view of container.children) {
			if (view instanceof WebContentsView && view.webContents.id === viewId) {
				return [view, container];
			}
		}
	}

	return undefined;
}
