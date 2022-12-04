import { onCleanup } from "solid-js";
import { createStore, reconcile } from "solid-js/store";

import { darkTheme, lightTheme } from "./theme";

export const usePreferredTheme = () => {
	const [theme, setTheme] = createStore(getPreferredTheme());
	const handleChange = () => {
		setTheme(reconcile(getPreferredTheme()));
	};

	darkSchemeQuery?.addEventListener("change", handleChange);

	onCleanup(() => {
		darkSchemeQuery?.removeEventListener("change", handleChange);
	});

	return theme;
};

const getPreferredTheme = () =>
	darkSchemeQuery?.matches
		? structuredClone(darkTheme)
		: structuredClone(lightTheme);

const darkSchemeQuery: MediaQueryList | undefined =
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	globalThis?.matchMedia?.("(prefers-color-scheme: dark)") ?? undefined;
