import { splitProps } from "solid-js";
import { tv } from "tailwind-variants";

import type { JSX } from "solid-js";
import type { VariantProps } from "tailwind-variants";

export default function Button(
	_props: Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "classList"> &
		VariantProps<typeof buttonClasses>,
) {
	const [localProps, passProps] = splitProps(_props, ["class", "type"]);

	return (
		<button
			{...passProps}
			type={localProps.type ?? "button"}
			class={buttonClasses({ class: localProps.class })}
		/>
	);
}

// https://ui.shadcn.com/docs/components/button

const buttonClasses = tv({
	base: "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive:
				"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline:
				"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary:
				"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline",
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "size-9",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
});
