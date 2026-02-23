import { Show, createMemo } from "solid-js";

import { tryOr } from "#common/lib/error";
import { formatMem } from "#common/lib/format";
import { Card } from "#renderer/components/card";
import { ChronoGraph } from "#renderer/components/chrono-graph";
import { useSystemStats } from "#renderer/hooks/use-system-stats";

import { InfoList } from "../../components/info-list";

import type { SystemStats } from "#main/services/system-stats";
import type { Sample } from "#renderer/components/chrono-graph";

function MemoryGraph(props: { systemStats: SystemStats | undefined }) {
	const sample = createMemo<Sample | undefined>(() => {
		const value = props.systemStats?.memUsed;

		return value ? { value: tryOr(() => BigInt(value), 0n) } : undefined;
	});

	const maxValue = createMemo<bigint>(() => {
		const value = props.systemStats?.memTotal;

		return value ? tryOr(() => BigInt(value), 0n) : 0n;
	});

	return (
		<ChronoGraph
			sampleSource={sample}
			minValue={0n}
			maxValue={maxValue()}
			class="h-24 w-full rounded-lg"
		/>
	);
}

export function SystemStatsCard() {
	const statsQuery = useSystemStats();

	return (
		<Card.Root>
			<Card.Header>
				<Card.Title>System stats</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="grid grid-cols-[1fr_26ch] gap-4">
					<MemoryGraph systemStats={statsQuery.data} />
					<Show when={statsQuery.data} fallback={<>loading...</>} keyed>
						{(info) => (
							<InfoList.Root>
								<InfoList.Entry>
									<InfoList.Label>total memory</InfoList.Label>
									<InfoList.Value>{formatMem(info.memTotal)}</InfoList.Value>
								</InfoList.Entry>
								<InfoList.Entry>
									<InfoList.Label>used memory</InfoList.Label>
									<InfoList.Value>{formatMem(info.memUsed)}</InfoList.Value>
								</InfoList.Entry>
							</InfoList.Root>
						)}
					</Show>
				</div>
			</Card.Content>
		</Card.Root>
	);
}
