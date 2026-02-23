import { Page } from "#renderer/layouts/page";

import { ThemeSwitch } from "./theme-switch";

export function Settings() {
	return (
		<>
			<Page.Header>Settings</Page.Header>
			<Page.Content>
				<ThemeSwitch />
			</Page.Content>
		</>
	);
}
