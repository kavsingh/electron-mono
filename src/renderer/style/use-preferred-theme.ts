import { onCleanup } from "solid-js";
import { createStore, reconcile } from "solid-js/store";

import { darkTheme, lightTheme } from "./theme";

export default function usePreferredTheme() {
	const [theme, setTheme] = createStore(getPreferredTheme());
	const handleChange = () => {
		setTheme(reconcile(getPreferredTheme()));
	};

	darkSchemeQuery?.addEventListener("change", handleChange);

	onCleanup(() => {
		darkSchemeQuery?.removeEventListener("change", handleChange);
	});

	return theme;
}

function getPreferredTheme() {
	return darkSchemeQuery?.matches
		? structuredClone(darkTheme)
		: structuredClone(lightTheme);
}

const darkSchemeQuery: MediaQueryList | undefined =
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	globalThis?.matchMedia?.("(prefers-color-scheme: dark)") ?? undefined;
