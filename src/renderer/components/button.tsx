import { splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";

import type { JSX } from "solid-js";

export default function Button(
	_props: Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "classList">,
) {
	const [localProps, passProps] = splitProps(_props, ["class", "type"]);

	return (
		<button
			{...passProps}
			type={localProps.type ?? "button"}
			class={twMerge(
				"rounded border border-neutral-800 px-2 py-1 transition-colors hover:border-neutral-950 focus-visible:border-neutral-950 active:border-neutral-950 dark:border-neutral-400 dark:hover:border-neutral-50 dark:focus-visible:border-neutral-50 dark:active:border-neutral-50",
				localProps.class,
			)}
		/>
	);
}
