import { Route, HashRouter } from "@solidjs/router";
import log from "electron-log/renderer";
import { createEffect } from "solid-js";

import { AppQueryClientProvider } from "./contexts/app-query-client";
import useTheme from "./hooks/use-theme";
import AppLayout from "./layouts/app";
import Files from "./pages/files";
import Home from "./pages/home";
import Settings from "./pages/settings";

export default function App() {
	const theme = useTheme();

	log.info("App mounted");

	createEffect(() => {
		document.documentElement.classList.toggle("dark", theme() === "dark");
	});

	return (
		<AppQueryClientProvider>
			<HashRouter root={AppLayout}>
				<Route path="/" component={Home} />
				<Route path="/files" component={Files} />
				<Route path="/settings" component={Settings} />
			</HashRouter>
		</AppQueryClientProvider>
	);
}
