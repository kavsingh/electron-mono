import { createMemo, createSignal, onCleanup } from "solid-js";

export default function useTheme() {
	const [userTheme] = createSignal<"system" | Theme>("system");
	const [queryTheme, setQueryTheme] = createSignal<Theme | undefined>(
		getQueryTheme(),
	);
	const theme = createMemo(() => {
		const user = userTheme();

		return user === "system" ? queryTheme() : user;
	});

	function handleQuery() {
		setQueryTheme(getQueryTheme());
	}

	lightSchemeQuery.addEventListener("change", handleQuery);
	darkSchemeQuery.addEventListener("change", handleQuery);

	onCleanup(() => {
		lightSchemeQuery.removeEventListener("change", handleQuery);
		darkSchemeQuery.removeEventListener("change", handleQuery);
	});

	return theme;
}

function getQueryTheme(): Theme | undefined {
	if (lightSchemeQuery.matches) return "light";
	if (darkSchemeQuery.matches) return "dark";

	return undefined;
}

const darkSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
const lightSchemeQuery = window.matchMedia("(prefers-color-scheme: light)");

export type Theme = "light" | "dark";
