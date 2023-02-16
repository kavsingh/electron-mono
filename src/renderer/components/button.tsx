import { createMemo } from "solid-js";
import { twMerge } from "tailwind-merge";

import type { JSX } from "solid-js";

export default function Button(
	props: JSX.ButtonHTMLAttributes<HTMLButtonElement>,
) {
	const className = createMemo(() =>
		twMerge(
			"rounded border border-100 plb-1 pli-2 hover:border-400 focus-visible:border-400 active:border-400",
			props.class,
		),
	);

	return (
		<button {...props} class={className()} classList={props.classList ?? {}} />
	);
}
