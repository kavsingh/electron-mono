import { twMerge } from "tailwind-merge";

import type { JSX } from "solid-js";

export default function Button(
	props: JSX.ButtonHTMLAttributes<HTMLButtonElement>,
) {
	return (
		<button
			{...props}
			class={twMerge(
				"rounded border border-zinc-800 px-2 py-1 hover:border-zinc-950 focus-visible:border-zinc-950 active:border-zinc-950 dark:border-zinc-400 dark:hover:border-zinc-50 dark:focus-visible:border-zinc-50 dark:active:border-zinc-50",
				props.class,
			)}
			classList={props.classList ?? {}}
		/>
	);
}
