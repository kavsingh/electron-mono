import { useLocation } from "@solidjs/router";
import { twMerge } from "tailwind-merge";

import type { ParentProps } from "solid-js";

export default function Nav() {
	return (
		<nav class="bg-sky-800">
			<ul class="container flex items-center p-3 text-gray-200">
				<NavItem href="/">Home</NavItem>
				<NavItem href="/about">About</NavItem>
			</ul>
		</nav>
	);
}

function NavItem(props: ParentProps<{ href: string }>) {
	const location = useLocation();

	return (
		<li
			class={twMerge(
				"mx-1.5 border-b-2 sm:mx-6",
				location.pathname === props.href ? "text-sky-200" : "text-gray-200",
			)}
		>
			<a href={props.href}>{props.children}</a>
		</li>
	);
}
