import PageHeader from "~/renderer/components/page-header";
import ThemeSwitch from "~/renderer/components/theme-switch";

export default function Preferences() {
	return (
		<>
			<PageHeader>Preferences</PageHeader>
			<ThemeSwitch />
		</>
	);
}
