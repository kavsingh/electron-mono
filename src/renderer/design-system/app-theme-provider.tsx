import { ThemeProvider } from "@emotion/react";
import { useEffect, useRef, useState } from "react";

import { darkTheme, lightTheme } from "./theme";

import type { Theme } from "./theme";
import type { FC, ReactNode } from "react";

const AppThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const prefersDarkQueryRef = useRef(getPrefersDarkSchemeQuery());
	const [theme, setTheme] = useState<Theme>(
		prefersDarkQueryRef.current?.matches ? darkTheme : lightTheme,
	);

	useEffect(() => {
		const { current: query } = prefersDarkQueryRef;

		if (!query) return;

		const handleQueryChange = ({ matches }: MediaQueryListEvent) => {
			setTheme(matches ? darkTheme : lightTheme);
		};

		query.addEventListener("change", handleQueryChange);

		return () => {
			query.removeEventListener("change", handleQueryChange);
		};
	}, []);

	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default AppThemeProvider;

const getPrefersDarkSchemeQuery = () =>
	typeof window !== "undefined" && typeof window.matchMedia === "function"
		? window.matchMedia("(prefers-color-scheme: dark)")
		: undefined;
