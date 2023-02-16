import { Router, hashIntegration, Route, Routes } from "@solidjs/router";

import Masthead from "./components/masthead";
import Files from "./pages/files";
import SystemInfo from "./pages/system-info";

export default function App() {
	return (
		<Router source={hashIntegration()}>
			<div class="bg-0 text-400 min-bs-full plb-8 pli-4">
				<div
					class="fixed z-[1] bs-8 inset-inline-0 block-start-0"
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
