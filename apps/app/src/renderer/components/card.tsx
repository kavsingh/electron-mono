// https://ui.shadcn.com/docs/components/card

import { tv } from "tailwind-variants";

import type { HTMLAttributes, RefAttributes } from "react";
import type { VariantProps } from "tailwind-variants";

//

export function CardRoot({
	className,
	ref,
	...passProps
}: Props<HTMLDivElement, typeof cardRootVariants>) {
	return (
		<div {...passProps} ref={ref} className={cardRootVariants({ className })} />
	);
}

const cardRootVariants = tv({
	base: "rounded-xl border border-border bg-card text-card-foreground shadow",
});

//

export function CardHeader({
	className,
	ref,
	...passProps
}: Props<HTMLDivElement, typeof cardHeaderVariants>) {
	return (
		<div
			{...passProps}
			ref={ref}
			className={cardHeaderVariants({ className })}
		/>
	);
}

const cardHeaderVariants = tv({
	base: "flex flex-col space-y-1.5 p-6",
});

//

export function CardTitle({
	className,
	ref,
	...passProps
}: Props<HTMLHeadingElement, typeof cardTitleVariants>) {
	return (
		<h3 {...passProps} ref={ref} className={cardTitleVariants({ className })} />
	);
}

const cardTitleVariants = tv({
	base: "font-semibold leading-none tracking-tight",
});

//

export function CardDescription({
	className,
	ref,
	...passProps
}: Props<HTMLParagraphElement, typeof cardDescriptionVariants>) {
	return (
		<p
			{...passProps}
			ref={ref}
			className={cardDescriptionVariants({ className })}
		/>
	);
}

const cardDescriptionVariants = tv({
	base: "text-sm text-muted-foreground",
});

//

export function CardContent({
	className,
	ref,
	...passProps
}: Props<HTMLDivElement, typeof cardContentVariants>) {
	return (
		<div
			{...passProps}
			ref={ref}
			className={cardContentVariants({ className })}
		/>
	);
}

const cardContentVariants = tv({
	base: "p-6 pt-0",
});

//

export function CardFooter({
	className,
	ref,
	...passProps
}: Props<HTMLDivElement, typeof cardFooterVariants>) {
	return (
		<div
			{...passProps}
			ref={ref}
			className={cardFooterVariants({ className })}
		/>
	);
}

const cardFooterVariants = tv({
	base: "flex items-center p-6 pt-0",
});

//

export default {
	Root: CardRoot,
	Header: CardHeader,
	Title: CardTitle,
	Description: CardDescription,
	Content: CardContent,
	Footer: CardFooter,
};

//

type Props<
	TElement extends HTMLElement,
	TVariants extends ReturnType<typeof tv>,
> = HTMLAttributes<TElement> &
	VariantProps<TVariants> &
	// TODO: remove this when react types updated for v19
	RefAttributes<TElement>;
