import { createSignal, onCleanup } from "solid-js";

export default function useTheme() {
	const [theme, setTheme] = createSignal<UiTheme | undefined>(getQueryTheme());

	function handleQuery() {
		setTheme(getQueryTheme());
	}

	lightSchemeQuery.addEventListener("change", handleQuery);
	darkSchemeQuery.addEventListener("change", handleQuery);

	onCleanup(() => {
		lightSchemeQuery.removeEventListener("change", handleQuery);
		darkSchemeQuery.removeEventListener("change", handleQuery);
	});

	return theme;
}

export type UiTheme = "dark" | "light";

function getQueryTheme(): UiTheme | undefined {
	if (lightSchemeQuery.matches) return "light";
	if (darkSchemeQuery.matches) return "dark";

	return undefined;
}

const darkSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
const lightSchemeQuery = window.matchMedia("(prefers-color-scheme: light)");
