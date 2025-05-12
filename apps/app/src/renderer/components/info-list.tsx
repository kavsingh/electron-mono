import { splitProps } from "solid-js";

import { tm } from "#renderer/lib/style";

import type { ComponentProps } from "solid-js";

export function InfoListRoot(props: Omit<ComponentProps<"ul">, "classList">) {
	const [localProps, passProps] = splitProps(props, ["class"]);

	return (
		<ul {...passProps} class={tm("m-0 list-none p-0", localProps.class)} />
	);
}

export function InfoListEntry(props: Omit<ComponentProps<"li">, "classList">) {
	const [localProps, passProps] = splitProps(props, ["class"]);

	return (
		<li
			{...passProps}
			class={tm(
				"border-b-border flex gap-2 border-b py-2 last:border-b-0",
				localProps.class,
			)}
		/>
	);
}

export function InfoListLabel(
	props: Omit<ComponentProps<"span">, "classList">,
) {
	const [localProps, passProps] = splitProps(props, ["class"]);

	return (
		<span
			{...passProps}
			class={tm("text-muted-foreground", localProps.class)}
		/>
	);
}

export function InfoListValue(
	props: Omit<ComponentProps<"span">, "classList">,
) {
	return <span {...props} />;
}

export default {
	Root: InfoListRoot,
	Entry: InfoListEntry,
	Label: InfoListLabel,
	Value: InfoListValue,
};
