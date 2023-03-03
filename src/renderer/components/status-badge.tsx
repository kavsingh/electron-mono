import type { ParentProps } from "solid-js";

export default function StatusBadge(props: ParentProps) {
	return <div class="rounded bg-text400 p-1 text-bg0">{props.children}</div>;
}
