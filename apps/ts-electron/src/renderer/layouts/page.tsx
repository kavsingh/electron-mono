import type { ParentProps } from "solid-js";

export function PageHeader(props: ParentProps) {
	return (
		<div class="sticky top-0 bg-white/60 p-4 pt-8 text-lg font-bold backdrop-blur-md dark:bg-neutral-900/60">
			<h2>{props.children}</h2>
		</div>
	);
}

export function PageContent(props: ParentProps) {
	return <div class="p-4">{props.children}</div>;
}

export default {
	Header: PageHeader,
	Content: PageContent,
};
