import { useEffect, useState } from "react";

import type { ThemeSource } from "#common/lib/theme";

export default function useTheme() {
	const [theme, setTheme] = useState<UiTheme | undefined>(getQueryTheme());

	useEffect(() => {
		function handleQuery() {
			setTheme(getQueryTheme());
		}

		lightSchemeQuery.addEventListener("change", handleQuery);
		darkSchemeQuery.addEventListener("change", handleQuery);

		return function cleanup() {
			lightSchemeQuery.removeEventListener("change", handleQuery);
			darkSchemeQuery.removeEventListener("change", handleQuery);
		};
	}, []);

	return theme;
}

export type UiTheme = Exclude<ThemeSource, "system">;

function getQueryTheme(): UiTheme | undefined {
	if (lightSchemeQuery.matches) return "light";
	if (darkSchemeQuery.matches) return "dark";

	return undefined;
}

const darkSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
const lightSchemeQuery = window.matchMedia("(prefers-color-scheme: light)");
