// https://ui.shadcn.com/docs/components/card

import { tv } from "tailwind-variants";

import type { ComponentPropsWithRef } from "react";
import type { VariantProps } from "tailwind-variants";

//

export function CardRoot({
	className,
	...passProps
}: ComponentPropsWithRef<"div"> & VariantProps<typeof cardRootVariants>) {
	return <div {...passProps} className={cardRootVariants({ className })} />;
}

const cardRootVariants = tv({
	base: "rounded-xl border border-border bg-card text-card-foreground shadow",
});

//

export function CardHeader({
	className,
	...passProps
}: ComponentPropsWithRef<"div"> & VariantProps<typeof cardHeaderVariants>) {
	return <div {...passProps} className={cardHeaderVariants({ className })} />;
}

const cardHeaderVariants = tv({
	base: "flex flex-col space-y-1.5 p-6",
});

//

export function CardTitle({
	className,
	...passProps
}: ComponentPropsWithRef<"h3"> & VariantProps<typeof cardTitleVariants>) {
	return <h3 {...passProps} className={cardTitleVariants({ className })} />;
}

const cardTitleVariants = tv({
	base: "font-semibold leading-none tracking-tight",
});

//

export function CardDescription({
	className,
	...passProps
}: ComponentPropsWithRef<"p"> & VariantProps<typeof cardDescriptionVariants>) {
	return (
		<p {...passProps} className={cardDescriptionVariants({ className })} />
	);
}

const cardDescriptionVariants = tv({
	base: "text-sm text-muted-foreground",
});

//

export function CardContent({
	className,
	...passProps
}: ComponentPropsWithRef<"div"> & VariantProps<typeof cardContentVariants>) {
	return <div {...passProps} className={cardContentVariants({ className })} />;
}

const cardContentVariants = tv({
	base: "p-6 pt-0",
});

//

export function CardFooter({
	className,
	...passProps
}: ComponentPropsWithRef<"div"> & VariantProps<typeof cardFooterVariants>) {
	return <div {...passProps} className={cardFooterVariants({ className })} />;
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
