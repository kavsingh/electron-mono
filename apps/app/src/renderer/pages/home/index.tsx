import Page from "#renderer/layouts/page";

import SystemInfoCard from "./system-info-card";
import SystemStatsCard from "./system-stats-card";

export default function Home() {
	return (
		<>
			<Page.Header>Home</Page.Header>
			<Page.Content>
				<div className="space-y-6">
					<SystemInfoCard />
					<SystemStatsCard />
				</div>
			</Page.Content>
		</>
	);
}
