import { tm } from "#renderer/lib/style";

import type { ComponentPropsWithRef } from "react";

export function InfoListRoot({
	className,
	...props
}: ComponentPropsWithRef<"ul">) {
	return <ul {...props} className={tm("m-0 list-none p-0", className)} />;
}

export function InfoListEntry({
	className,
	...props
}: ComponentPropsWithRef<"li">) {
	return (
		<li
			{...props}
			className={tm(
				"flex gap-2 border-b border-b-border py-2 last:border-b-0",
				className,
			)}
		/>
	);
}

export function InfoListLabel({
	className,
	...props
}: ComponentPropsWithRef<"span">) {
	return <span {...props} className={tm("text-muted-foreground", className)} />;
}

export function InfoListValue(props: ComponentPropsWithRef<"span">) {
	return <span {...props} />;
}

export const InfoList = {
	Root: InfoListRoot,
	Entry: InfoListEntry,
	Label: InfoListLabel,
	Value: InfoListValue,
};
