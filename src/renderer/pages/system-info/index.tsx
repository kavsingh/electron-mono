import Page from "~/renderer/layouts/page";

import SystemInfoList from "./system-info-list";

export default function SystemInfo() {
	return (
		<Page.Root>
			<Page.Header>System Info</Page.Header>
			<Page.Content>
				<SystemInfoList />
			</Page.Content>
		</Page.Root>
	);
}
