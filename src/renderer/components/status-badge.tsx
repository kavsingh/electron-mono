import type { ParentProps } from "solid-js";

export default function StatusBadge(props: ParentProps) {
	return (
		<div class="rounded bg-neutral-900 p-1 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-950">
			{props.children}
		</div>
	);
}
