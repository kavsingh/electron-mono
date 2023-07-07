import { createStore } from "solid-js/store";

const [uiStore, setUiStore] = createStore<{ savedTheme: SavedTheme }>({
	savedTheme: "system",
});

function saveTheme(theme: SavedTheme) {
	setUiStore({ savedTheme: theme });
}

export { uiStore, saveTheme };

export type Theme = "light" | "dark";
export type SavedTheme = "system" | Theme;
