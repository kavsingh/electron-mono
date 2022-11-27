import { useQuery } from "@tanstack/react-query";

import { fetchDaemonVersion } from "~/renderer/services/ntk-daemon";
import { NtkDaemonQueryKey } from "~/renderer/services/ntk-daemon/constants";

export default function Version() {
	const { data: version, error } = useQuery({
		queryKey: [NtkDaemonQueryKey.DaemonVersion],
		queryFn: fetchDaemonVersion,
	});

	return (
		<>
			{version ? `Running NTK Daemon ${formatVersion(version)}` : null}
			{error ? `Error getting NTK Daemon version ${String(error)}` : null}
		</>
	);
}

const formatVersion = ({
	major,
	minor,
	micro,
	build,
}: {
	major: bigint;
	minor: bigint;
	micro: bigint;
	build: string;
}) => `${major.toString()}.${minor.toString()}.${micro.toString()} ${build}`;
