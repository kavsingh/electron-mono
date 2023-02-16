import { Router } from "@solidjs/router";
import userEvent from "@testing-library/user-event";

import type { ParentProps } from "solid-js";

export function setupRenderWrapper() {
	const user = userEvent.setup();

	return { user, Wrapper };
}

function Wrapper(props: ParentProps) {
	return <Router>{props.children}</Router>;
}
