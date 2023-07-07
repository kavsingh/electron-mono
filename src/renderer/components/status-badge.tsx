import type { ParentProps } from "solid-js";

export default function StatusBadge(props: ParentProps) {
	return (
		<div class="rounded bg-zinc-900 p-1 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-950">
			{props.children}
		</div>
	);
}
