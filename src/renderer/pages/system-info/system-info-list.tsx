import { Show, For, createResource, onCleanup } from "solid-js";

import { measuredAsyncFn } from "~/common/measure";
import { useTRPCClient } from "~/renderer/contexts/trpc-client";

export default function SystemInfoList() {
	const client = useTRPCClient();
	const [infoResource, { mutate }] = createResource(
		measuredAsyncFn("getSystemInfo", () => client.systemInfo.query()),
	);
	const subscription = client.heartbeat.subscribe(undefined, {
		onData: mutate,
	});

	onCleanup(() => subscription.unsubscribe());

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
