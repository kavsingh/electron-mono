import { TanStackDevtools } from "@tanstack/solid-devtools";
import { SolidQueryDevtoolsPanel } from "@tanstack/solid-query-devtools";
import { createRootRoute, Link, Outlet } from "@tanstack/solid-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/solid-router-devtools";
import { createEffect, Show, splitProps } from "solid-js";

import { usePrefersDark } from "~/renderer/hooks/theme";

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
			<div class="grid grid-cols-[max-content_1fr] block-full inline-full">
				<div class="bg-linear-to-l from-background p-4 pe-8 pbs-10 text-sm min-block-full">
					<nav class="flex flex-col gap-2">
						<NavLink href="/">Home</NavLink>
						<NavLink href="/files">Files</NavLink>
						<NavLink href="/settings">Settings</NavLink>
					</nav>
				</div>
				<div class="overflow-x-hidden overflow-y-auto bg-background block-full">
					<Outlet />
					<Show when={import.meta.env.DEV}>
						<TanStackDevtools
							plugins={[
								{
									name: "TanStack Query",
									render: <SolidQueryDevtoolsPanel />,
									defaultOpen: true,
								},
								{
									name: "TanStack Router",
									render: <TanStackRouterDevtoolsPanel />,
									defaultOpen: false,
								},
							]}
						/>
					</Show>
				</div>
			</div>
			<div class="fixed inset-x-0 inset-bs-0 z-10 [-webkit-app-region:drag] block-8" />
		</>
	);
}

export const Route = createRootRoute({ component: RootLayout });
