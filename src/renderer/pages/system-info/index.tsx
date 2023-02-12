import PageHeader from "~/renderer/components/page-header";

import SystemInfoList from "./system-info-list";

import type { Component } from "solid-js";

const SystemInfo: Component = () => (
	<>
		<PageHeader>System Info</PageHeader>
		<SystemInfoList />
	</>
);

export default SystemInfo;
