import { ThemeProvider } from "@emotion/react";
import { useEffect, useState } from "react";

import { darkTheme, lightTheme } from "./theme";

import type { Theme } from "./theme";
import type { FC, ReactNode } from "react";

const AppThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const prefersDarkQuery = getPrefersDarkSchemeQuery();
	const [theme, setTheme] = useState<Theme>(
		prefersDarkQuery?.matches ? darkTheme : lightTheme,
	);

	useEffect(() => {
		if (!prefersDarkQuery) return;

		const handleQueryChange = ({ matches }: MediaQueryListEvent) => {
			setTheme(matches ? darkTheme : lightTheme);
		};

		prefersDarkQuery.addEventListener("change", handleQueryChange);

		return () => {
			prefersDarkQuery.removeEventListener("change", handleQueryChange);
		};
	}, [prefersDarkQuery]);

	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default AppThemeProvider;

const getPrefersDarkSchemeQuery = () =>
	typeof window !== "undefined" && typeof window.matchMedia === "function"
		? window.matchMedia("(prefers-color-scheme: dark)")
		: undefined;
