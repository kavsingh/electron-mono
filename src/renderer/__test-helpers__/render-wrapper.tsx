import { Router } from "@solidjs/router";
import userEvent from "@testing-library/user-event";

import AppThemeProvider from "../style/app-theme-provider";

import type { ParentComponent } from "solid-js";

export const setupRenderWrapper = () => {
	const user = userEvent.setup();
	const Wrapper: ParentComponent = (props) => (
		<Router>
			<AppThemeProvider>{props.children}</AppThemeProvider>
		</Router>
	);

	return { user, Wrapper };
};
