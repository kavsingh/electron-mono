import { tryOr } from "#common/lib/error";
import { formatMem } from "#common/lib/format";
import Card from "#renderer/components/card";
import ChronoGraph from "#renderer/components/chrono-graph";
import useSystemStats from "#renderer/hooks/use-system-stats";

import InfoList from "../../components/info-list";

// eslint-disable-next-line import-x/no-restricted-paths
import type { SystemStats } from "#main/services/system-stats";

export default function SystemStatsCard() {
	const { data: stats } = useSystemStats();

	return (
		<Card.Root>
			<Card.Header>
				<Card.Title>System stats</Card.Title>
			</Card.Header>
			<Card.Content>
				<div className="grid grid-cols-[1fr_26ch] gap-4">
					<MemoryGraph systemStats={stats} />
					{stats ? (
						<InfoList.Root>
							<InfoList.Entry>
								<InfoList.Label>total memory</InfoList.Label>
								<InfoList.Value>{formatMem(stats.memTotal)}</InfoList.Value>
							</InfoList.Entry>
							<InfoList.Entry>
								<InfoList.Label>used memory</InfoList.Label>
								<InfoList.Value>{formatMem(stats.memUsed)}</InfoList.Value>
							</InfoList.Entry>
						</InfoList.Root>
					) : (
						<>loading...</>
					)}
				</div>
			</Card.Content>
		</Card.Root>
	);
}

function MemoryGraph(props: { systemStats: SystemStats | undefined }) {
	const memUsed = props.systemStats?.memUsed;
	const memTotal = props.systemStats?.memTotal;

	const sample = memUsed
		? { value: tryOr(() => BigInt(memUsed), 0n) }
		: undefined;

	const maxValue = memTotal ? tryOr(() => BigInt(memTotal), 0n) : 0n;

	return (
		<ChronoGraph
			sampleSource={sample}
			minValue={0n}
			maxValue={maxValue}
			className="h-24 w-full rounded-lg"
		/>
	);
}
