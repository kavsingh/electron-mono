import { onCleanup } from "solid-js";

export default function ColorSchemeEffects() {
	darkSchemeQuery.addEventListener("change", handleQuery);

	onCleanup(() => {
		darkSchemeQuery.removeEventListener("change", handleQuery);
	});

	handleQuery();

	return null;
}

function handleQuery() {
	document.documentElement.classList.toggle("dark", darkSchemeQuery.matches);
}

const darkSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
