// https://ui.shadcn.com/docs/components/card

import { splitProps } from "solid-js";

import { tm } from "#renderer/lib/style";

import type { ComponentProps } from "solid-js";

export function CardRoot(props: Omit<ComponentProps<"div">, "classList">) {
	const [localProps, passProps] = splitProps(props, ["class"]);

	return (
		<div
			{...passProps}
			class={tm(
				"rounded-xl border border-border bg-card text-card-foreground shadow-sm",
				localProps.class,
			)}
		/>
	);
}

//

export function CardHeader(props: Omit<ComponentProps<"div">, "classList">) {
	const [localProps, passProps] = splitProps(props, ["class"]);

	return (
		<div
			{...passProps}
			class={tm("flex flex-col space-y-1.5 p-6", localProps.class)}
		/>
	);
}

//

export function CardTitle(props: Omit<ComponentProps<"h3">, "classList">) {
	const [localProps, passProps] = splitProps(props, ["class"]);

	return (
		<h3
			{...passProps}
			class={tm("leading-none font-semibold tracking-tight", localProps.class)}
		/>
	);
}

//

export function CardDescription(props: Omit<ComponentProps<"p">, "classList">) {
	const [localProps, passProps] = splitProps(props, ["class"]);

	return (
		<p
			{...passProps}
			class={tm("text-sm text-muted-foreground", localProps.class)}
		/>
	);
}

//

export function CardContent(props: Omit<ComponentProps<"div">, "classList">) {
	const [localProps, passProps] = splitProps(props, ["class"]);

	return <div {...passProps} class={tm("p-6 pt-0", localProps.class)} />;
}

//

export function CardFooter(props: Omit<ComponentProps<"div">, "classList">) {
	const [localProps, passProps] = splitProps(props, ["class"]);

	return (
		<div
			{...passProps}
			class={tm("flex items-center p-6 pt-0", localProps.class)}
		/>
	);
}

//

export default {
	Root: CardRoot,
	Header: CardHeader,
	Title: CardTitle,
	Description: CardDescription,
	Content: CardContent,
	Footer: CardFooter,
};
