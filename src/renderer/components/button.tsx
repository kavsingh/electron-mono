import type { Component, JSX } from "solid-js";

const Button: Component<JSX.ButtonHTMLAttributes<HTMLButtonElement>> = (
	props,
) => (
	<button
		{...props}
		class={`rounded border border-100 plb-1 pli-2 hover:border-400 focus-visible:border-400 active:border-400 ${
			props.class ?? ""
		}`}
		classList={props.classList ?? {}}
	/>
);

export default Button;
