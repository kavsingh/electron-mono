import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { RouterProvider, createRouter } from "@tanstack/solid-router";
import { render } from "solid-js/web";

import "./index.css";
import { routeTree } from "./route-tree.gen.ts";

function createTanstackRouter() {
	return createRouter({ routeTree });
}

declare module "@tanstack/solid-router" {
	interface Register {
		router: ReturnType<typeof createTanstackRouter>;
	}
}

const appRoot = document.getElementById("app-root");

if (!appRoot) throw new Error("#app-root not found");

const client = new QueryClient();
const router = createTanstackRouter();

const dispose = render(
	() => (
		<QueryClientProvider client={client}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	),
	appRoot,
);

if (import.meta.hot) import.meta.hot.dispose(dispose);
