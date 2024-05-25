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
									{info.osName} {info.osVersion} ({info.osArch})
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
	for (const [threshold, unit] of thresholds) {
		if (mem >= threshold) {
			return `${bigintDiv(mem, threshold).toFixed(2)} ${unit}`;
		}
	}

	return "-";
}

// https://stackoverflow.com/a/54409977
function bigintDiv(dividend: bigint, divisor: bigint, precision = 100n) {
	return Number((dividend * precision) / divisor) / Number(precision);
}

const thresholds = [
	[BigInt(1024 * 1024 * 1024), "GB"],
	[BigInt(1024 * 1024), "MB"],
	[1024n, "KB"],
	[0n, "B"],
] as const;
