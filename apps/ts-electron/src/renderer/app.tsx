import { ApolloProvider } from "@merged/solid-apollo";
import { Route, HashRouter } from "@solidjs/router";
import { createEffect } from "solid-js";

import { createApolloClient } from "./graphql/client";
import useTheme from "./hooks/use-theme";
import AppLayout from "./layouts/app";
import Files from "./pages/files";
import Preferences from "./pages/preferences";
import SystemInfo from "./pages/system-info";

export default function App() {
	const theme = useTheme();

	createEffect(() => {
		document.documentElement.classList.toggle("dark", theme() === "dark");
	});

	return (
		<ApolloProvider client={createApolloClient()}>
			<HashRouter root={AppLayout}>
				<Route path="/" component={SystemInfo} />
				<Route path="/files" component={Files} />
				<Route path="/preferences" component={Preferences} />
			</HashRouter>
		</ApolloProvider>
	);
}
