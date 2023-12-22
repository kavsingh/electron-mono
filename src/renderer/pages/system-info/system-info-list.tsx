import { Show } from "solid-js";

import useSystemInfo from "#renderer/hooks/use-system-info";

import type { ParentProps } from "solid-js";

export default function SystemInfoList() {
	const infoQuery = useSystemInfo();

	return (
		<Show when={infoQuery.data} fallback={<>Loading...</>} keyed>
			{(info) => (
				<ul class="m-0 flex list-none flex-col gap-2 p-0">
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
	);
}

function InfoEntry(props: ParentProps) {
	return (
		<li class="flex gap-2 border-b border-b-neutral-200 pb-2 last:border-b-0 last:pb-0 dark:border-b-neutral-700">
			{props.children}
		</li>
	);
}

function InfoEntryLabel(props: ParentProps) {
	return <span class="font-semibold text-neutral-500">{props.children}</span>;
}

function formatMem(mem: bigint) {
	return `${(Number(mem) / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
