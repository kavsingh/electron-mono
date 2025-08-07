import { net } from "electron";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import log from "electron-log";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const rendererRoot = path.resolve(dirname, "../renderer");

export const APP_PROTOCOL_SCHEME = "app";
export const APP_RENDERER_HOST = "renderer";
export const APP_RENDERER_URL = `${APP_PROTOCOL_SCHEME}://${APP_RENDERER_HOST}`;

export async function appProtocolHandler(request: Request): Promise<Response> {
	const { host, pathname } = new URL(request.url);

	log.info("handling app protocol", { host, pathname });

	if (host !== APP_RENDERER_HOST) {
		log.error("unknown host", { host, pathname });

		return new Response("unknown host", {
			status: 400,
			headers: { "content-type": "text/html" },
		});
	}

	const pathToServe =
		pathname === "/"
			? "index.html"
			: path.resolve(rendererRoot, pathname.replace(/^\//, ""));
	const relativePath = path.relative(rendererRoot, pathToServe);
	const isSafe =
		relativePath &&
		!relativePath.startsWith("..") &&
		!path.isAbsolute(relativePath);

	if (!isSafe) {
		log.error("unsafe filepath", { pathname, relativePath });

		return new Response(`unsafe path: ${pathname}`, {
			status: 400,
			headers: { "content-type": "text/html" },
		});
	}

	const fileUrl = pathToFileURL(pathToServe).href;

	log.info("fetching file", { pathToServe, fileUrl });

	try {
		return await net.fetch(fileUrl);
	} catch (cause) {
		log.error("failed to load", cause);

		throw cause instanceof Error
			? cause
			: new Error("failed to load", { cause });
	}
}
