import type { ParentComponent } from "solid-js";

const StatusBadge: ParentComponent = (props) => (
	<div class="rounded bg-inverse-400 p-1 text-inverse-0">{props.children}</div>
);

export default StatusBadge;
