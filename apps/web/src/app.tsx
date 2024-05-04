import { Router } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";

import Nav from "#components/nav";
import "./app.css";

const ColorSchemeEffects = clientOnly(
	() => import("#components/color-scheme-effects"),
);

export default function App() {
	return (
		<>
			<ColorSchemeEffects />
			<Router
				root={(props) => (
					<>
						<Nav />
						<Suspense>{props.children}</Suspense>
					</>
				)}
			>
				<FileRoutes />
			</Router>
		</>
	);
}
