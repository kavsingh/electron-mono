import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "#server/api/root";

import type { APIEvent } from "@solidjs/start/server";

function handler(event: APIEvent) {
	// adapts tRPC to fetch API style requests
	return fetchRequestHandler({
		// the endpoint handling the requests
		endpoint: "/api/trpc",
		// the request object
		req: event.request,
		// the router for handling the requests
		router: appRouter,
		// any arbitary data that should be available to all actions
		createContext: () => event,
	});
}

export const GET = handler;
export const POST = handler;
