import { Show, For } from "solid-js";

import useSystemInfo from "~/renderer/hooks/use-system-info";

export default function SystemInfoList() {
	const infoQuery = useSystemInfo();

	return (
		<Show when={infoQuery.data} fallback={<>Loading...</>} keyed>
			{(info) => (
				<ul class="m-0 flex list-none flex-col gap-2 p-0">
					<For each={Object.entries(info)}>
						{([key, val]) => (
							<li class="flex gap-2 border-b border-b-neutral-200 pb-2 last:border-b-0 last:pb-0 dark:border-b-neutral-700">
								<span class="font-semibold text-neutral-500">{key}</span>
								<span>{String(val)}</span>
							</li>
						)}
					</For>
				</ul>
			)}
		</Show>
	);
}
