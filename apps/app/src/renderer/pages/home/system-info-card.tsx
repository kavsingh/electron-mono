import { Show } from "solid-js";

import Card from "#renderer/components/card";
import useSystemInfo from "#renderer/hooks/use-system-info";

import type { ParentProps } from "solid-js";

export default function SystemInfoCard() {
	const infoQuery = useSystemInfo();

	return (
		<Card.Root>
			<Card.Header>
				<Card.Title>System info</Card.Title>
			</Card.Header>
			<Card.Content>
				<Show when={infoQuery.data} fallback={<>loading...</>} keyed>
					{(info) => (
						<ul class="m-0 list-none p-0">
							<InfoEntry>
								<InfoEntryLabel>os</InfoEntryLabel>
								<span>
									{info.osName} ({info.osVersion}) {info.osArch}
								</span>
							</InfoEntry>
							<InfoEntry>
								<InfoEntryLabel>total memory</InfoEntryLabel>
								<span>{formatMem(info.memTotal)}</span>
							</InfoEntry>
							<InfoEntry>
								<InfoEntryLabel>available memory</InfoEntryLabel>
								<span>{formatMem(info.memAvailable)}</span>
							</InfoEntry>
						</ul>
					)}
				</Show>
			</Card.Content>
		</Card.Root>
	);
}

function InfoEntry(props: ParentProps) {
	return (
		<li class="flex gap-2 border-b border-b-border p-2 last:border-b-0">
			{props.children}
		</li>
	);
}

function InfoEntryLabel(props: ParentProps) {
	return <span class="text-muted-foreground">{props.children}</span>;
}

function formatMem(mem: bigint) {
	return `${(Number(mem) / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
