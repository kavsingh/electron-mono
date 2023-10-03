import { A } from "@solidjs/router";

export default function Sidebar() {
	return (
		<div class="min-h-full p-4 pt-8">
			<nav class="flex flex-col gap-2">
				<A href="/">System Info</A>
				<A href="/files">Files</A>
				<A href="/preferences">Preferences</A>
			</nav>
		</div>
	);
}
