import { Link, Outlet } from "react-router-dom";

import type { ComponentProps } from "react";

export default function App() {
	return (
		<>
			<div className="grid size-full grid-cols-[max-content_1fr]">
				<div className="min-h-full bg-gradient-to-l from-background p-4 pe-8 pt-10 text-sm">
					<nav className="flex flex-col gap-2">
						<NavLink to="/">Home</NavLink>
						<NavLink to="/files">Files</NavLink>
						<NavLink to="/settings">Settings</NavLink>
						<NavLink to="/web">Web</NavLink>
					</nav>
				</div>
				<div className="h-full overflow-y-auto overflow-x-hidden bg-background">
					<Outlet />
				</div>
			</div>
			<div className="fixed inset-x-0 top-0 z-10 h-8 [-webkit-app-region:drag]" />
		</>
	);
}

function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
	return (
		<Link
			{...props}
			className="text-muted-foreground transition-colors hover:underline aria-[current=page]:text-foreground aria-[current=page]:hover:no-underline"
		/>
	);
}
