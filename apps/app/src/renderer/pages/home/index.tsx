import Page from "#renderer/layouts/page";

import SystemInfoCard from "./system-info-card";

export default function Home() {
	return (
		<>
			<Page.Header>Home</Page.Header>
			<Page.Content>
				<SystemInfoCard />
			</Page.Content>
		</>
	);
}
