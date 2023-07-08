import { Router, hashIntegration, Route, Routes } from "@solidjs/router";
import { createEffect } from "solid-js";

import Masthead from "./components/masthead";
import { TRPCClientProvider } from "./contexts/trpc-client";
import useTheme from "./hooks/use-theme";
import Files from "./pages/files";
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
				<div class="min-h-full px-4 py-8">
					<div
						class="fixed inset-x-0 top-0 z-[1] h-8"
						style={{ "-webkit-app-region": "drag" }}
					/>
					<Masthead />
					<Routes>
						<Route path="/" element={<SystemInfo />} />
						<Route path="/files" element={<Files />} />
					</Routes>
				</div>
			</Router>
		</TRPCClientProvider>
	);
}
