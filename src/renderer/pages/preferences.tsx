import ThemeSwitch from "~/renderer/components/theme-switch";
import Page from "~/renderer/layouts/page";

export default function Preferences() {
	return (
		<>
			<Page.Header>Preferences</Page.Header>
			<Page.Content>
				<ThemeSwitch />
			</Page.Content>
		</>
	);
}
