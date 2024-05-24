import { Route, HashRouter } from "@solidjs/router";
import log from "electron-log/renderer";
import { createEffect } from "solid-js";

import { AppQueryClientProvider } from "./contexts/app-query-client";
import useTheme from "./hooks/use-theme";
import AppLayout from "./layouts/app";
import Files from "./pages/files";
import Preferences from "./pages/preferences";
import SystemInfo from "./pages/system-info";
import Web from "./pages/web";

export default function App() {
	const theme = useTheme();

	log.info("App mounted");

	createEffect(() => {
		document.documentElement.classList.toggle("dark", theme() === "dark");
	});

	return (
		<AppQueryClientProvider>
			<HashRouter root={AppLayout}>
				<Route path="/" component={SystemInfo} />
				<Route path="/files" component={Files} />
				<Route path="/preferences" component={Preferences} />
				<Route path="/web" component={Web} />
			</HashRouter>
		</AppQueryClientProvider>
	);
}
