import { createMutation, createQuery } from "@merged/solid-apollo";
import { For, Match, Switch } from "solid-js";

import { ThemeSource } from "#renderer/graphql/__generated__/types";

import {
	SetThemeSourceDocument,
	ThemeSourceDocument,
} from "./theme-switch.generated";

import type {
	SetThemeSourceMutation,
	ThemeSourceQuery,
} from "./theme-switch.generated";

export default function ThemeSwitch() {
	const themeSource = createQuery<ThemeSourceQuery>(
		// @ts-expect-error upstream
		ThemeSourceDocument,
	);
	const [setThemeSource] = createMutation<SetThemeSourceMutation>(
		// @ts-expect-error upstream
		SetThemeSourceDocument,
		{ refetchQueries: [ThemeSourceDocument, "themeSource"] },
	);

	function saveThemeSource(theme: ThemeSource) {
		void setThemeSource({ variables: { input: theme } });
	}

	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
			}}
		>
			<fieldset>
				<legend class="mb-2 font-semibold">Theme</legend>
				<ul class="flex gap-3">
					<For each={[ThemeSource.System, ThemeSource.Light, ThemeSource.Dark]}>
						{(option) => (
							<li class="flex items-center gap-1">
								<input
									type="radio"
									id={option}
									name={option}
									value={option}
									checked={themeSource()?.themeSource === option}
									onChange={[saveThemeSource, option]}
									class="peer h-4 w-4 cursor-pointer"
								/>
								<label
									class="cursor-pointer text-neutral-500 transition-colors peer-checked:text-black dark:peer-checked:text-white"
									for={option}
								>
									<LabelText themeSource={option} />
								</label>
							</li>
						)}
					</For>
				</ul>
			</fieldset>
		</form>
	);
}

function LabelText(props: { themeSource: ThemeSource }) {
	return (
		<Switch fallback={null}>
			<Match when={props.themeSource === ThemeSource.System}>
				<>System</>
			</Match>
			<Match when={props.themeSource === ThemeSource.Dark}>
				<>Dark</>
			</Match>
			<Match when={props.themeSource === ThemeSource.Light}>
				<>Light</>
			</Match>
		</Switch>
	);
}
