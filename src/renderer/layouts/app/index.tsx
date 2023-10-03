import Sidebar from "./sidebar";

import type { ParentProps } from "solid-js";

export default function App(props: ParentProps) {
	return (
		<>
			<div class="grid h-full grid-cols-app-layout">
				<Sidebar />
				<div class="h-full overflow-auto">{props.children}</div>
			</div>
			<div
				class="fixed inset-x-0 top-0 z-10 h-8"
				style={{ "-webkit-app-region": "drag" }}
			/>
		</>
	);
}
