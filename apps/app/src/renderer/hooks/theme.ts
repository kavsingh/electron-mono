import { createSignal, onCleanup } from "solid-js";

import type { Accessor } from "solid-js";

const darkSchemeQuery = globalThis.matchMedia("(prefers-color-scheme: dark)");

export function usePrefersDark(): Accessor<boolean> {
	const [prefersDarkScheme, setPrefersDarkScheme] = createSignal(
		darkSchemeQuery.matches,
	);

	function onChange() {
		setPrefersDarkScheme(darkSchemeQuery.matches);
	}

	darkSchemeQuery.addEventListener("change", onChange);

	onCleanup(() => {
		darkSchemeQuery.removeEventListener("change", onChange);
	});

	return prefersDarkScheme;
}
