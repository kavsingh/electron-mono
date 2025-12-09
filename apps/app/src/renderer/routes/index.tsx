import { createFileRoute } from "@tanstack/react-router";

import { Page } from "#renderer/layouts/page";

import { SystemInfoCard } from "./-index/system-info-card";
import { SystemStatsCard } from "./-index/system-stats-card";

export function Index() {
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

export const Route = createFileRoute("/")({ component: Index });
