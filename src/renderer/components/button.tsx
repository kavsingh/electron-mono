import { twMerge } from "tailwind-merge";

import type { JSX } from "solid-js";

export default function Button(
	props: JSX.ButtonHTMLAttributes<HTMLButtonElement>,
) {
	return (
		<button
			{...props}
			class={twMerge(
				"rounded border border-accent100 px-2 py-1 hover:border-accent400 focus-visible:border-accent400 active:border-accent400",
				props.class,
			)}
			classList={props.classList ?? {}}
		/>
	);
}
