import styled from "@emotion/styled";
import { DaemonStatusEvent_Type } from "@nativeinstruments/ntk-daemon-node-lib";
import { memo, useCallback, useEffect, useState } from "react";

import bridge from "~/renderer/bridge";
import Pulse from "~/renderer/components/pulse";
import StatusBadge from "~/renderer/components/status-badge";

import type { DaemonStatusEvent } from "@nativeinstruments/ntk-daemon-node-lib";
import type { FC } from "react";

const NTKDaemon: FC = () => {
	const [version, setVersion] = useState<Version>();
	const [error, setError] = useState<Error | null>(null);
	const [status, setStatus] = useState<DaemonStatusEvent_Type>();
	const [pulseKey, setPulseKey] = useState(Date.now());

	const fetchVersion = useCallback(async () => {
		setError(null);

		try {
			setVersion(await bridge.getNtkDaemonVersion());
		} catch (reason) {
			setError(reason instanceof Error ? reason : new Error(String(reason)));
		}
	}, []);

	useEffect(() => {
		void fetchVersion();

		const handleStatusEvent = ({ type }: DaemonStatusEvent) => {
			setStatus(type);
			setPulseKey(Date.now());

			if (type === DaemonStatusEvent_Type.startup_ended) void fetchVersion();
		};

		return bridge.subscribeNtkDaemonStatus(handleStatusEvent);
	}, [fetchVersion]);

	return (
		<div>
			<Header>
				<h2>NTK Daemon</h2>
				<Pulse key={pulseKey}>
					<StatusBadge>{status ? formatStatusType(status) : ""}</StatusBadge>
				</Pulse>
			</Header>
			{version ? `Running NTK Daemon ${formatVersion(version)}` : null}
			{error ? `Error getting NTK Daemon version ${String(error)}` : null}
		</div>
	);
};

export default memo(NTKDaemon);

const Header = styled.header`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

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

const formatVersion = (version: Version) =>
	`${version.major.toString()}.${version.minor.toString()}.${version.micro.toString()} ${
		version.build
	}`;

type Version = AsyncResult<typeof bridge.getNtkDaemonVersion>;
