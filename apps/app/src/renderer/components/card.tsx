// https://ui.shadcn.com/docs/components/card

import { splitProps } from "solid-js";
import { tv } from "tailwind-variants";

import type { JSX } from "solid-js";
import type { VariantProps } from "tailwind-variants";

//

export function CardRoot(
	props: Props<HTMLDivElement, typeof cardRootVariants>,
) {
	const [localProps, passProps] = splitProps(props, ["class"]);

	return (
		<div {...passProps} class={cardRootVariants({ class: localProps.class })} />
	);
}

const cardRootVariants = tv({
	base: "rounded-xl border border-border bg-card text-card-foreground shadow",
});

//

export function CardHeader(
	props: Props<HTMLDivElement, typeof cardHeaderVariants>,
) {
	const [localProps, passProps] = splitProps(props, ["class"]);

	return (
		<div
			{...passProps}
			class={cardHeaderVariants({ class: localProps.class })}
		/>
	);
}

const cardHeaderVariants = tv({
	base: "flex flex-col space-y-1.5 p-6",
});

//

export function CardTitle(
	props: Props<HTMLHeadingElement, typeof cardTitleVariants>,
) {
	const [localProps, passProps] = splitProps(props, ["class"]);

	return (
		<h3 {...passProps} class={cardTitleVariants({ class: localProps.class })} />
	);
}

const cardTitleVariants = tv({
	base: "font-semibold leading-none tracking-tight",
});

//

export function CardDescription(
	props: Props<HTMLParagraphElement, typeof cardDescriptionVariants>,
) {
	const [localProps, passProps] = splitProps(props, ["class"]);

	return (
		<p
			{...passProps}
			class={cardDescriptionVariants({ class: localProps.class })}
		/>
	);
}

const cardDescriptionVariants = tv({
	base: "text-sm text-muted-foreground",
});

//

export function CardContent(
	props: Props<HTMLDivElement, typeof cardContentVariants>,
) {
	const [localProps, passProps] = splitProps(props, ["class"]);

	return (
		<div
			{...passProps}
			class={cardContentVariants({ class: localProps.class })}
		/>
	);
}

const cardContentVariants = tv({
	base: "p-6 pt-0",
});

//

export function CardFooter(
	props: Props<HTMLDivElement, typeof cardFooterVariants>,
) {
	const [localProps, passProps] = splitProps(props, ["class"]);

	return (
		<div
			{...passProps}
			class={cardFooterVariants({ class: localProps.class })}
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
> = Omit<JSX.HTMLAttributes<TElement>, "classList"> & VariantProps<TVariants>;
