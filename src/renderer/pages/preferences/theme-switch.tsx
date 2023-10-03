import { For, Match, Switch, createResource } from "solid-js";

import { THEME_SOURCES } from "~/common/lib/theme";
import { useTRPCClient } from "~/renderer/contexts/trpc-client";

import type { ThemeSource } from "~/common/lib/theme";

export default function ThemeSwitch() {
	const client = useTRPCClient();
	const [themeSource, { mutate }] = createResource(() => {
		return client.themeSource.query();
	});

	async function saveThemeSource(theme: ThemeSource) {
		mutate(await client.setThemeSource.mutate(theme));
	}

	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
			}}
		>
			<fieldset>
				<legend>Theme</legend>
				<div class="flex gap-3">
					<For each={THEME_SOURCES}>
						{(option) => (
							<label for={option}>
								<LabelText themeSource={option} />
								<input
									type="radio"
									id={option}
									name={option}
									value={option}
									checked={themeSource() === option}
									onChange={[saveThemeSource, option]}
								/>
							</label>
						)}
					</For>
				</div>
			</fieldset>
		</form>
	);
}

function LabelText(props: { themeSource: ThemeSource }) {
	return (
		<Switch>
			<Match when={props.themeSource === "system"}>
				<>System</>
			</Match>
			<Match when={props.themeSource === "light"}>
				<>Light</>
			</Match>
			<Match when={props.themeSource === "dark"}>
				<>Dark</>
			</Match>
		</Switch>
	);
}
