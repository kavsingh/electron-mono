import { For, Match, Switch } from "solid-js";

import { saveTheme, uiStore } from "~/renderer/stores/ui";

import type { JSX } from "solid-js";
import type { SavedTheme } from "~/renderer/stores/ui";

export default function ThemeSwitch() {
	const themeOptions: SavedTheme[] = ["system", "dark", "light"];
	const handleRadio: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event> = (
		event,
	) => {
		if (event.currentTarget.value === "system") saveTheme("system");
		if (event.currentTarget.value === "light") saveTheme("light");
		if (event.currentTarget.value === "dark") saveTheme("dark");
	};

	return (
		<form onSubmit={(ev) => ev.preventDefault()}>
			<fieldset>
				<legend>Theme</legend>
				<div class="flex gap-3">
					<For each={themeOptions}>
						{(option) => (
							<label for={option}>
								<LabelText theme={option} />
								<input
									type="radio"
									id={option}
									name={option}
									value={option}
									checked={uiStore.savedTheme === option}
									onChange={handleRadio}
								/>
							</label>
						)}
					</For>
				</div>
			</fieldset>
		</form>
	);
}

function LabelText(props: { theme: SavedTheme }) {
	return (
		<Switch fallback={null}>
			<Match when={props.theme === "system"}>
				<>System</>
			</Match>
			<Match when={props.theme === "light"}>
				<>Light</>
			</Match>
			<Match when={props.theme === "dark"}>
				<>Dark</>
			</Match>
		</Switch>
	);
}
