import { Router, hashIntegration, Route, Routes } from "@solidjs/router";

import Masthead from "./components/masthead";
import Files from "./pages/files";
import SystemInfo from "./pages/system-info";

export default function App() {
	return (
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
	);
}
