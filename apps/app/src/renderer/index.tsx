import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { SuperJSON } from "superjson";
import { ipcLink } from "trpc-electron/renderer";

import { routeTree } from "./route-tree.gen";
import { trpc } from "./trpc";

function createTanstackRouter() {
	return createRouter({ routeTree });
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createTanstackRouter>;
	}
}

const appRoot = document.getElementById("app-root");

if (!appRoot) throw new Error("#app-root not found");

const client = new QueryClient();
const router = createTanstackRouter();
const trpcClient = trpc.createClient({
	links: [ipcLink({ transformer: SuperJSON })],
});

const root = createRoot(appRoot);

root.render(
	<StrictMode>
		<trpc.Provider client={trpcClient} queryClient={client}>
			<QueryClientProvider client={client}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</trpc.Provider>
	</StrictMode>,
);
