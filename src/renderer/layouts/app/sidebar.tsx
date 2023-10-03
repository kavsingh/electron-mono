import { A } from "@solidjs/router";

export default function Sidebar() {
	return (
		<div>
			<nav class="flex flex-col gap-2">
				<A href="/">System Info</A>
				<A href="/files">Files</A>
				<A href="/preferences">Preferences</A>
			</nav>
		</div>
	);
}
