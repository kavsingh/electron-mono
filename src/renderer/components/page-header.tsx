import type { ParentProps } from "solid-js";

export default function PageHeader(props: ParentProps) {
	return <h2 class="text-lg">{props.children}</h2>;
}
