import { twMerge } from "tailwind-merge";

import type { JSX } from "solid-js";

export default function Button(
	props: JSX.ButtonHTMLAttributes<HTMLButtonElement>,
) {
	return (
		<button
			{...props}
			class={twMerge(
				"rounded border border-border100 plb-1 pli-2 hover:border-border400 focus-visible:border-border400 active:border-border400",
				props.class,
			)}
			classList={props.classList ?? {}}
		/>
	);
}
