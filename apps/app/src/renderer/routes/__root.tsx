import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import { createRootRoute, Link, Outlet } from "@tanstack/solid-router";
import { TanStackRouterDevtools } from "@tanstack/solid-router-devtools";
import { createEffect, Show, splitProps } from "solid-js";

import { usePrefersDark } from "#renderer/hooks/theme";

import type { ComponentProps } from "solid-js";

function NavLink(
	_props: Omit<ComponentProps<typeof Link>, "class" | "classList">,
) {
	const [props, passProps] = splitProps(_props, ["children"]);

	return (
		<Link
			{...passProps}
			class="text-muted-foreground transition-colors hover:underline aria-[current=page]:text-foreground aria-[current=page]:hover:no-underline"
		>
			{props.children}
		</Link>
	);
}

function RootLayout() {
	const prefersDark = usePrefersDark();

	createEffect(() => {
		document.documentElement.classList.toggle("dark", prefersDark());
	});

	return (
		<>
			<div class="grid size-full grid-cols-[max-content_1fr]">
				<div class="min-h-full bg-linear-to-l from-background p-4 pe-8 pt-10 text-sm">
					<nav class="flex flex-col gap-2">
						<NavLink href="/">Home</NavLink>
						<NavLink href="/files">Files</NavLink>
						<NavLink href="/settings">Settings</NavLink>
					</nav>
				</div>
				<div class="h-full overflow-x-hidden overflow-y-auto bg-background">
					<Outlet />
					<Show when={import.meta.env.DEV}>
						<TanStackRouterDevtools />
						<SolidQueryDevtools />
					</Show>
				</div>
			</div>
			<div class="fixed inset-x-0 top-0 z-10 h-8 [-webkit-app-region:drag]" />
		</>
	);
}

export const Route = createRootRoute({ component: RootLayout });
