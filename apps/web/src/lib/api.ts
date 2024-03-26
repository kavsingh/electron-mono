import { createTRPCProxyClient, httpBatchLink, loggerLink } from "@trpc/client";

import type { AppRouter } from "#server/api/root";

function getBaseUrl() {
	if (typeof window !== "undefined") return "";
	if (process.env["NODE_ENV"] === "production") return "https://example.com";

	return `http://localhost:${process.env["PORT"] ?? "3000"}`;
}

export const api = createTRPCProxyClient<AppRouter>({
	links: [loggerLink(), httpBatchLink({ url: `${getBaseUrl()}/api/trpc` })],
});
