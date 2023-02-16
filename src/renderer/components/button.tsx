import { twMerge } from "tailwind-merge";

import type { JSX } from "solid-js";

export default function Button(
	props: JSX.ButtonHTMLAttributes<HTMLButtonElement>,
) {
	return (
		<button
			{...props}
			class={twMerge(
				"rounded border border-100 plb-1 pli-2 hover:border-400 focus-visible:border-400 active:border-400",
				props.class,
			)}
			classList={props.classList ?? {}}
		/>
	);
}
