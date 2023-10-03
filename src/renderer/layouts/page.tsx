import type { ParentProps } from "solid-js";

export function PageRoot(props: ParentProps) {
	return (
		<div class="min-h-full bg-white dark:bg-neutral-900">{props.children}</div>
	);
}

export function PageHeader(props: ParentProps) {
	return (
		<div class="sticky top-0 bg-white/60 p-4 pt-8 backdrop-blur-md dark:bg-neutral-900/60">
			{props.children}
		</div>
	);
}

export function PageContent(props: ParentProps) {
	return <div class="p-4">{props.children}</div>;
}

export default {
	Root: PageRoot,
	Header: PageHeader,
	Content: PageContent,
};
