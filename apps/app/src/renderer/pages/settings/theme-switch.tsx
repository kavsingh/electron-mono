import {
	createMutation,
	createQuery,
	useQueryClient,
} from "@tanstack/solid-query";
import { For, Match, Switch } from "solid-js";

import { THEME_SOURCES } from "#common/lib/theme";
import Card from "#renderer/components/card";
import { tipc } from "#renderer/tipc";

import type { ThemeSource } from "#common/lib/theme";

export default function ThemeSwitch() {
	const queryClient = useQueryClient();
	const { data: themeSource } = createQuery(() => ({
		queryKey: ["themeSource"],
		queryFn: () => tipc.getThemeSource.invoke(),
	}));

	const { mutate: setThemeSource } = createMutation(() => ({
		mutationFn: (source: ThemeSource) => tipc.setThemeSource.invoke(source),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["themeSource"] });
		},
	}));

	return (
		<Card.Root>
			<form
				onSubmit={(event) => {
					event.preventDefault();
				}}
			>
				<fieldset>
					<Card.Header>
						<Card.Title>
							<legend>Theme</legend>
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<ul class="flex gap-3">
							<For each={THEME_SOURCES}>
								{(option) => (
									<li class="flex items-center gap-1">
										<input
											type="radio"
											id={option}
											name={option}
											value={option}
											checked={themeSource === option}
											onChange={() => {
												setThemeSource(option);
											}}
											class="peer size-4 cursor-pointer"
										/>
										<label
											class="cursor-pointer text-muted-foreground transition-colors peer-checked:text-foreground"
											for={option}
										>
											<LabelText themeSource={option} />
										</label>
									</li>
								)}
							</For>
						</ul>
					</Card.Content>
				</fieldset>
			</form>
		</Card.Root>
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
