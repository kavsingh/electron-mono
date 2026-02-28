import { createFileRoute } from "@tanstack/solid-router";

import { Page } from "#renderer/layouts/page";

import { ThemeSwitch } from "./-settings/theme-switch";

function Settings() {
	return (
		<>
			<Page.Header>Settings</Page.Header>
			<Page.Content>
				<ThemeSwitch />
			</Page.Content>
		</>
	);
}

export const Route = createFileRoute("/settings")({ component: Settings });
