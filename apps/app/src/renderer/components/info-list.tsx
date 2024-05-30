import { tv } from "tailwind-variants";

import type { ComponentPropsWithRef } from "react";
import type { VariantProps } from "tailwind-variants";

export function InfoListRoot({
	className,
	...props
}: ComponentPropsWithRef<"ul"> & VariantProps<typeof infoListRootVariants>) {
	return <ul {...props} className={infoListRootVariants({ className })} />;
}

const infoListRootVariants = tv({ base: "m-0 list-none p-0" });

export function InfoListEntry({
	className,
	...props
}: ComponentPropsWithRef<"li"> & VariantProps<typeof infoListEntryVariants>) {
	return <li {...props} className={infoListEntryVariants({ className })} />;
}

const infoListEntryVariants = tv({
	base: "flex gap-2 border-b border-b-border py-2 last:border-b-0",
});

export function InfoListLabel({
	className,
	...props
}: ComponentPropsWithRef<"span"> & VariantProps<typeof infoListLabelVariants>) {
	return <span {...props} className={infoListLabelVariants({ className })} />;
}

const infoListLabelVariants = tv({ base: "text-muted-foreground" });

export function InfoListValue(props: ComponentPropsWithRef<"span">) {
	return <span {...props} />;
}

export default {
	Root: InfoListRoot,
	Entry: InfoListEntry,
	Label: InfoListLabel,
	Value: InfoListValue,
};
