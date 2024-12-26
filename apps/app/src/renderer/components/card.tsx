// https://ui.shadcn.com/docs/components/card

import { splitProps } from "solid-js";
import { tv } from "tailwind-variants";

import type { ComponentProps } from "solid-js";
import type { VariantProps } from "tailwind-variants";

export function CardRoot(
	props: Omit<ComponentProps<"div">, "classList"> &
		VariantProps<typeof cardRootVariants>,
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
	props: Omit<ComponentProps<"div">, "classList"> &
		VariantProps<typeof cardHeaderVariants>,
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
	props: Omit<ComponentProps<"h3">, "classList"> &
		VariantProps<typeof cardTitleVariants>,
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
	props: Omit<ComponentProps<"p">, "classList"> &
		VariantProps<typeof cardDescriptionVariants>,
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
	props: Omit<ComponentProps<"div">, "classList"> &
		VariantProps<typeof cardContentVariants>,
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
	props: Omit<ComponentProps<"div">, "classList"> &
		VariantProps<typeof cardFooterVariants>,
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
