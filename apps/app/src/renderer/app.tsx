import log from "electron-log/renderer";
import { useEffect } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";

import { AppQueryClientProvider } from "./contexts/app-query-client";
import useTheme from "./hooks/use-theme";
import AppLayout from "./layouts/app";
import Files from "./pages/files";
import Home from "./pages/home";
import Settings from "./pages/settings";
import Web from "./pages/web";

export default function App() {
	const theme = useTheme();

	log.info("App mounted");

	useEffect(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
	}, [theme]);

	return (
		<AppQueryClientProvider>
			<HashRouter>
				<Routes>
					<Route element={<AppLayout />}>
						<Route path="/" element={<Home />} />
						<Route path="/files" element={<Files />} />
						<Route path="/settings" element={<Settings />} />
						<Route path="/web" element={<Web />} />
					</Route>
				</Routes>
			</HashRouter>
		</AppQueryClientProvider>
	);
}
