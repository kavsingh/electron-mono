import ThemeSwitch from "~/renderer/components/theme-switch";
import Page from "~/renderer/layouts/page";

export default function Preferences() {
	return (
		<Page.Root>
			<Page.Header>Preferences</Page.Header>
			<Page.Content>
				<ThemeSwitch />
			</Page.Content>
		</Page.Root>
	);
}
