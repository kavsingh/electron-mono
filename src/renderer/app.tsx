import { Router, hashIntegration, Route, Routes } from "@solidjs/router";
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
			<Router source={hashIntegration()}>
				<AppLayout>
					<Routes>
						<Route path="/" element={<SystemInfo />} />
						<Route path="/files" element={<Files />} />
						<Route path="/preferences" element={<Preferences />} />
					</Routes>
				</AppLayout>
			</Router>
		</TRPCClientProvider>
	);
}
