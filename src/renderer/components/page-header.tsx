import type { ParentComponent } from "solid-js";

const PageHeader: ParentComponent = (props) => (
	<h2 class="text-lg">{props.children}</h2>
);

export default PageHeader;
