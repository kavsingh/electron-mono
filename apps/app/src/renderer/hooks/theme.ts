import { useSyncExternalStore } from "react";

const state = (() => {
	const query = globalThis.matchMedia("(prefers-color-scheme: dark)");
	let prefersDark = query.matches;

	query.addEventListener("change", (event) => {
		prefersDark = event.matches;
	});

	return {
		snapshot: () => prefersDark,
		subscribe: (subscriber: () => void) => {
			query.addEventListener("change", subscriber);

			return () => {
				query.removeEventListener("change", subscriber);
			};
		},
	};
})();

export function usePrefersDark() {
	return useSyncExternalStore(state.subscribe, state.snapshot);
}
