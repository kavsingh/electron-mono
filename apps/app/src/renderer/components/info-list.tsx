import { splitProps } from "solid-js";
import { tv } from "tailwind-variants";

import type { ComponentProps } from "solid-js";
import type { VariantProps } from "tailwind-variants";

export function InfoListRoot(
	props: Omit<ComponentProps<"ul">, "classList"> &
		VariantProps<typeof infoListRootVariants>,
) {
	const [localProps, passProps] = splitProps(props, ["class"]);

	return (
		<ul
			{...passProps}
			class={infoListRootVariants({ class: localProps.class })}
		/>
	);
}

const infoListRootVariants = tv({ base: "m-0 list-none p-0" });

export function InfoListEntry(
	props: Omit<ComponentProps<"li">, "classList"> &
		VariantProps<typeof infoListEntryVariants>,
) {
	const [localProps, passProps] = splitProps(props, ["class"]);

	return (
		<li
			{...passProps}
			class={infoListEntryVariants({ class: localProps.class })}
		/>
	);
}

const infoListEntryVariants = tv({
	base: "flex gap-2 border-b border-b-border py-2 last:border-b-0",
});

export function InfoListLabel(
	props: Omit<ComponentProps<"span">, "classList"> &
		VariantProps<typeof infoListLabelVariants>,
) {
	const [localProps, passProps] = splitProps(props, ["class"]);

	return (
		<span
			{...passProps}
			class={infoListLabelVariants({ class: localProps.class })}
		/>
	);
}

const infoListLabelVariants = tv({ base: "text-muted-foreground" });

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
