// https://ui.shadcn.com/docs/components/card

import { splitProps } from "solid-js";
import { tv } from "tailwind-variants";

import type { JSX } from "solid-js";
import type { VariantProps } from "tailwind-variants";

//

export function CardRoot(
	_props: Omit<JSX.HTMLAttributes<HTMLDivElement>, "classList"> &
		VariantProps<typeof cardRootClasses>,
) {
	const [localProps, passProps] = splitProps(_props, ["class"]);

	return (
		<div {...passProps} class={cardRootClasses({ class: localProps.class })} />
	);
}

const cardRootClasses = tv({
	base: "rounded-xl border border-border bg-card text-card-foreground shadow",
});

//

export function CardHeader(
	_props: Omit<JSX.HTMLAttributes<HTMLDivElement>, "classList"> &
		VariantProps<typeof cardHeaderClasses>,
) {
	const [localProps, passProps] = splitProps(_props, ["class"]);

	return (
		<div
			{...passProps}
			class={cardHeaderClasses({ class: localProps.class })}
		/>
	);
}

const cardHeaderClasses = tv({
	base: "flex flex-col space-y-1.5 p-6",
});

//

export function CardTitle(
	_props: Omit<JSX.HTMLAttributes<HTMLHeadingElement>, "classList"> &
		VariantProps<typeof cardTitleClasses>,
) {
	const [localProps, passProps] = splitProps(_props, ["class"]);

	return (
		<h3 {...passProps} class={cardTitleClasses({ class: localProps.class })} />
	);
}

const cardTitleClasses = tv({
	base: "font-semibold leading-none tracking-tight",
});

//

export function CardDescription(
	_props: Omit<JSX.HTMLAttributes<HTMLParagraphElement>, "classList"> &
		VariantProps<typeof cardDescriptionClasses>,
) {
	const [localProps, passProps] = splitProps(_props, ["class"]);

	return (
		<p
			{...passProps}
			class={cardDescriptionClasses({ class: localProps.class })}
		/>
	);
}

const cardDescriptionClasses = tv({
	base: "text-sm text-muted-foreground",
});

//

export function CardContent(
	_props: Omit<JSX.HTMLAttributes<HTMLDivElement>, "classList"> &
		VariantProps<typeof cardContentClasses>,
) {
	const [localProps, passProps] = splitProps(_props, ["class"]);

	return (
		<div
			{...passProps}
			class={cardContentClasses({ class: localProps.class })}
		/>
	);
}

const cardContentClasses = tv({
	base: "p-6 pt-0",
});

//

export function CardFooter(
	_props: Omit<JSX.HTMLAttributes<HTMLDivElement>, "classList"> &
		VariantProps<typeof cardFooterClasses>,
) {
	const [localProps, passProps] = splitProps(_props, ["class"]);

	return (
		<div
			{...passProps}
			class={cardFooterClasses({ class: localProps.class })}
		/>
	);
}

const cardFooterClasses = tv({
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
