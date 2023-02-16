import PageHeader from "~/renderer/components/page-header";

import SystemInfoList from "./system-info-list";

export default function SystemInfo() {
	return (
		<>
			<PageHeader>System Info</PageHeader>
			<SystemInfoList />
		</>
	);
}
