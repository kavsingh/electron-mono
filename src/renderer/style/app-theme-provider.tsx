import { ThemeProvider } from "solid-styled-components";

import usePreferredTheme from "./use-preferred-theme";

import type { ParentComponent } from "solid-js";

const AppThemeProvider: ParentComponent = (props) => {
	const theme = usePreferredTheme();

	return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};

export default AppThemeProvider;
