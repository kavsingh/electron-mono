import Sidebar from "./sidebar";

import type { ParentProps } from "solid-js";

export default function App(props: ParentProps) {
	return (
		<div class="grid h-full grid-cols-app-layout">
			<div class="min-h-full p-8 ps-4">
				<Sidebar />
			</div>
			<div class="min-h-full bg-white p-4 pt-8 dark:bg-neutral-900">
				{props.children}
			</div>
		</div>
	);
}
