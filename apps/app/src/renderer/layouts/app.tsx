import { A } from "@solidjs/router";

import type { ComponentProps, ParentProps } from "solid-js";

export default function App(props: ParentProps) {
	return (
		<>
			<div class="grid size-full grid-cols-[max-content_1fr]">
				<div class="from-background min-h-full bg-gradient-to-l p-4 pe-8 pt-10 text-sm">
					<nav class="flex flex-col gap-2">
						<NavLink href="/">Home</NavLink>
						<NavLink href="/files">Files</NavLink>
						<NavLink href="/settings">Settings</NavLink>
					</nav>
				</div>
				<div class="bg-background h-full overflow-x-hidden overflow-y-auto">
					{props.children}
				</div>
			</div>
			<div class="fixed inset-x-0 top-0 z-10 h-8 [-webkit-app-region:drag]" />
		</>
	);
}

function NavLink(props: Omit<ComponentProps<typeof A>, "class" | "classList">) {
	return (
		<A
			{...props}
			class="text-muted-foreground aria-[current=page]:text-foreground transition-colors hover:underline aria-[current=page]:hover:no-underline"
		/>
	);
}
