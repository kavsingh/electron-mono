import type { ParentProps } from "solid-js";

export function InfoListRoot(props: ParentProps) {
	return <ul class="m-0 list-none p-0">{props.children}</ul>;
}

export function InfoListEntry(props: ParentProps) {
	return (
		<li class="flex gap-2 border-b border-b-border py-2 last:border-b-0">
			{props.children}
		</li>
	);
}

export function InfoListLabel(props: ParentProps) {
	return <span class="text-muted-foreground">{props.children}</span>;
}

export function InfoListValue(props: ParentProps) {
	return <span>{props.children}</span>;
}

export default {
	Root: InfoListRoot,
	Entry: InfoListEntry,
	Label: InfoListLabel,
	Value: InfoListValue,
};
