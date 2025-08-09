import { net } from "electron";
import path from "node:path";
import { pathToFileURL } from "node:url";

import log from "electron-log";

import { RENDERER_ROOT } from "./known-paths";

export const APP_PROTOCOL_SCHEME = "app";
export const APP_RENDERER_HOST = "renderer";
export const APP_RENDERER_URL = `${APP_PROTOCOL_SCHEME}://${APP_RENDERER_HOST}/`;

export async function appProtocolHandler(request: Request): Promise<Response> {
	const { host, pathname } = new URL(request.url);

	log.debug("handling app protocol", { host, pathname });

	switch (host) {
		case APP_RENDERER_HOST: {
			const isRoot = pathname === "" || pathname === "/";

			return serveFile(isRoot ? "index.html" : pathname, RENDERER_ROOT);
		}

		default: {
			log.error("invalid host", { host, pathname });

			return new Response("invalid host", {
				status: 400,
				headers: { "content-type": "text/html" },
			});
		}
	}
}

async function serveFile(filepath: string, fileRoot: string) {
	const resolvedPath = path.resolve(fileRoot, filepath.replace(/^\//, ""));
	const relativePath = path.relative(fileRoot, resolvedPath);
	const isSafe =
		relativePath &&
		!relativePath.startsWith("..") &&
		!path.isAbsolute(relativePath);

	if (!isSafe) {
		log.error("unsafe filepath", { resolvedPath, relativePath });

		return new Response("unsafe path", {
			status: 400,
			headers: { "content-type": "text/html" },
		});
	}

	const fileUrl = pathToFileURL(resolvedPath).href;

	log.debug("fetching file", { resolvedPath, fileUrl });

	try {
		return await net.fetch(fileUrl);
	} catch (cause) {
		log.error("failed to load", cause);

		return new Response(`failed to load: ${String(cause)}`, {
			status: 500,
			headers: { "content-type": "text/html" },
		});
	}
}
