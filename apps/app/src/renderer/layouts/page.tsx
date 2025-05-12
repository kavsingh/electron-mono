import type { ParentProps } from "solid-js";

export function PageHeader(props: ParentProps) {
	return (
		<header class="bg-background/50 sticky top-0 p-4 pt-8 backdrop-blur-md">
			<h2 class="text-3xl leading-none font-semibold">{props.children}</h2>
		</header>
	);
}

export function PageContent(props: ParentProps) {
	return <main class="p-4">{props.children}</main>;
}

export default {
	Header: PageHeader,
	Content: PageContent,
};
