import { Route, HashRouter } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { createEffect } from "solid-js";

import { TRPCClientProvider } from "./contexts/trpc-client";
import useTheme from "./hooks/use-theme";
import AppLayout from "./layouts/app";
import Files from "./pages/files";
import Preferences from "./pages/preferences";
import SystemInfo from "./pages/system-info";
import { getTRPCClient } from "./trpc/client";

export default function App() {
	const theme = useTheme();

	createEffect(() => {
		document.documentElement.classList.toggle("dark", theme() === "dark");
	});

	return (
		<TRPCClientProvider client={getTRPCClient()}>
			<QueryClientProvider client={new QueryClient()}>
				<HashRouter root={AppLayout}>
					<Route path="/" component={SystemInfo} />
					<Route path="/files" component={Files} />
					<Route path="/preferences" component={Preferences} />
				</HashRouter>
			</QueryClientProvider>
		</TRPCClientProvider>
	);
}
