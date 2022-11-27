import { DaemonStatusEvent_Type } from "@nativeinstruments/ntk-daemon-node-lib";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import bridge from "~/renderer/bridge";
import Pulse from "~/renderer/components/pulse";
import StatusBadge from "~/renderer/components/status-badge";
import { fetchDaemonVersion } from "~/renderer/services/ntk-daemon";
import { NtkDaemonQueryKey } from "~/renderer/services/ntk-daemon/constants";

import type { DaemonStatusEvent } from "@nativeinstruments/ntk-daemon-node-lib";

export default function StatusIndicator() {
	const { refetch } = useQuery({
		queryKey: [NtkDaemonQueryKey.DaemonVersion],
		queryFn: fetchDaemonVersion,
	});
	const [status, setStatus] = useState<DaemonStatusEvent_Type>();
	const [pulseKey, setPulseKey] = useState(Date.now());

	useEffect(() => {
		const handleStatusEvent = ({ type }: DaemonStatusEvent) => {
			setStatus(type);
			setPulseKey(Date.now());

			if (type === DaemonStatusEvent_Type.startup_ended) void refetch();
		};

		return bridge.subscribeNtkDaemonStatus(handleStatusEvent);
	}, [refetch]);

	return (
		<Pulse key={pulseKey}>
			<StatusBadge>{status ? formatStatusType(status) : ""}</StatusBadge>
		</Pulse>
	);
}

const formatStatusType = (type: DaemonStatusEvent_Type) => {
	switch (type) {
		case DaemonStatusEvent_Type.startup_started:
			return "Daemon Starting";
		case DaemonStatusEvent_Type.startup_ended:
			return "Daemon Started";
		case DaemonStatusEvent_Type.heartbeat:
			return "Daemon Heartbeat";
		default:
			return "";
	}
};
