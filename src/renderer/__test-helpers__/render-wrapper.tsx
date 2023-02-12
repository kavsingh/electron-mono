import { Router } from "@solidjs/router";
import userEvent from "@testing-library/user-event";

import type { ParentComponent } from "solid-js";

export function setupRenderWrapper() {
	const user = userEvent.setup();
	const Wrapper: ParentComponent = (props) => <Router>{props.children}</Router>;

	return { user, Wrapper };
}
