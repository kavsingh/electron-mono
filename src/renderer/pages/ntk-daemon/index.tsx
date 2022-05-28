import { useEffect, useState } from "react";

import bridge from "~/renderer/bridge";

import type { FC } from "react";

const NTKDaemon: FC = () => {
	const [version, setVersion] = useState<Version>();

	useEffect(() => {
		void bridge.getNtkDaemonVersion().then(setVersion);
	}, []);

	return (
		<div>
			<h2>NTK Daemon</h2>
			{version ? `Running daemon ${formatVersion(version)}` : null}
		</div>
	);
};

export default NTKDaemon;

const formatVersion = (version: Version) =>
	`${version.major.toString()}.${version.minor.toString()}.${version.micro.toString()} ${
		version.build
	}`;

type Version = AsyncResult<typeof bridge.getNtkDaemonVersion>;
