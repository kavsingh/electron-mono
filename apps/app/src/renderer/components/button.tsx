// https://ui.shadcn.com/docs/components/button

import { splitProps } from "solid-js";

import { tv } from "#renderer/lib/style";

import type { VariantProps } from "#renderer/lib/style";
import type { ComponentProps } from "solid-js";

export default function Button(
	props: Omit<ComponentProps<"button">, "classList"> &
		VariantProps<typeof buttonVariants>,
) {
	const [localProps, passProps] = splitProps(props, [
		"class",
		"type",
		"variant",
		"size",
	]);

	return (
		<button
			{...passProps}
			type={localProps.type ?? "button"}
			class={buttonVariants({
				variant: localProps.variant,
				size: localProps.size,
				class: localProps.class,
			})}
		/>
	);
}

const buttonVariants = tv({
	base: "focus-visible:ring-ring inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow",
			destructive:
				"bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
			outline:
				"border-input bg-background hover:bg-accent hover:text-accent-foreground border shadow-sm",
			secondary:
				"bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
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
