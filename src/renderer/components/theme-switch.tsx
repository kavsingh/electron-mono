import { For, Match, Switch, createResource } from "solid-js";

import { THEME_SOURCES, type ThemeSource } from "~/common/lib/theme";
import { getTRPCClient } from "~/renderer/trpc/client";

import type { JSX } from "solid-js";

export default function ThemeSwitch() {
	const [themeSource, { refetch }] = createResource(getThemeSource);

	async function saveThemeSource(theme: ThemeSource) {
		await getTRPCClient().setThemeSource.mutate(theme);
		await refetch();
	}

	const handleRadio: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event> = (
		event,
	) => {
		if (event.currentTarget.value === "system") void saveThemeSource("system");
		if (event.currentTarget.value === "light") void saveThemeSource("light");
		if (event.currentTarget.value === "dark") void saveThemeSource("dark");
	};

	return (
		<form onSubmit={(ev) => ev.preventDefault()}>
			<fieldset>
				<legend>Theme</legend>
				<div class="flex gap-3">
					<For each={THEME_SOURCES}>
						{(option) => (
							<label for={option}>
								<LabelText theme={option} />
								<input
									type="radio"
									id={option}
									name={option}
									value={option}
									checked={themeSource() === option}
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

function LabelText(props: { theme: ThemeSource }) {
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

function getThemeSource() {
	return getTRPCClient().themeSource.query();
}
