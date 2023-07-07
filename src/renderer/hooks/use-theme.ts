import { createMemo, createSignal, onCleanup } from "solid-js";

import { uiStore } from "~/renderer/stores/ui";

import type { Theme } from "~/renderer/stores/ui";

export default function useTheme() {
	const [queryTheme, setQueryTheme] = createSignal<Theme | undefined>(
		getQueryTheme(),
	);
	const theme = createMemo(() => {
		return uiStore.savedTheme === "system" ? queryTheme() : uiStore.savedTheme;
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
