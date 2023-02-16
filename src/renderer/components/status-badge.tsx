import type { ParentProps } from "solid-js";

export default function StatusBadge(props: ParentProps) {
	return (
		<div class="rounded bg-inverse-400 p-1 text-inverse-0">
			{props.children}
		</div>
	);
}
