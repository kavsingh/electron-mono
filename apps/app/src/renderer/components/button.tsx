// https://ui.shadcn.com/docs/components/button

import { tv } from "#renderer/lib/style";

import type { VariantProps } from "#renderer/lib/style";
import type { ComponentPropsWithRef } from "react";

export default function Button({
	className,
	type,
	variant,
	size,
	...props
}: Props) {
	return (
		<button
			{...props}
			type={type ?? "button"}
			className={buttonVariants({ variant, size, className })}
		/>
	);
}

interface Props
	extends ComponentPropsWithRef<"button">,
		VariantProps<typeof buttonVariants> {}

const buttonVariants = tv({
	base: "inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
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
