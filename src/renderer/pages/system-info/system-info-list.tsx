import { Show, For } from "solid-js";

import useSystemInfo from "~/renderer/hooks/use-system-info";

export default function SystemInfoList() {
	const infoResource = useSystemInfo();

	return (
		<Show when={infoResource()} fallback={<>Loading...</>} keyed>
			{(info) => (
				<ul class="m-0 flex list-none flex-col gap-2 p-0">
					<For each={Object.entries(info)}>
						{([key, val]) => (
							<li class="flex gap-1 border-b border-b-zinc-800 pb-2 last:border-b-0 last:pb-0 dark:border-b-zinc-300">
								<span class="after:content-[':']">{key}</span>
								<span>{String(val)}</span>
							</li>
						)}
					</For>
				</ul>
			)}
		</Show>
	);
}
