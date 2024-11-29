import { createResource } from "solid-js";

import Page from "#renderer/layouts/page";
import { tipc } from "#renderer/tipc";

import SystemInfoCard from "./system-info-card";
import SystemStatsCard from "./system-stats-card";

export default function Home() {
	return (
		<>
			<Page.Header>Home</Page.Header>
			<Page.Content>
				<div class="space-y-6">
					<SystemInfoCard />
					<SystemStatsCard />
					<TIPC />
				</div>
			</Page.Content>
		</>
	);
}

function TIPC() {
	const [ping] = createResource(() => tipc.invoke("ping"));
	const [pingMessage] = createResource(() =>
		tipc.invoke("pingMessage", "message"),
	);

	return (
		<div class="space-y-2">
			<div>{ping()}</div>
			<div>{pingMessage()}</div>
		</div>
	);
}
