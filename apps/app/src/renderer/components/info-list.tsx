import type { PropsWithChildren } from "react";

export function InfoListRoot(props: PropsWithChildren) {
	return <ul className="m-0 list-none p-0">{props.children}</ul>;
}

export function InfoListEntry(props: PropsWithChildren) {
	return (
		<li className="flex gap-2 border-b border-b-border py-2 last:border-b-0">
			{props.children}
		</li>
	);
}

export function InfoListLabel(props: PropsWithChildren) {
	return <span className="text-muted-foreground">{props.children}</span>;
}

export function InfoListValue(props: PropsWithChildren) {
	return <span>{props.children}</span>;
}

export default {
	Root: InfoListRoot,
	Entry: InfoListEntry,
	Label: InfoListLabel,
	Value: InfoListValue,
};
