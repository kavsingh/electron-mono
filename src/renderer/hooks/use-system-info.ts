import { createResource, onCleanup } from "solid-js";

import { useTRPCClient } from "~/renderer/contexts/trpc-client";

export default function useSystemInfo() {
	const client = useTRPCClient();
	const [infoResource, { mutate }] = createResource(() => {
		return client.systemInfo.query();
	});
	const subscription = client.systemInfoEvent.subscribe(undefined, {
		onData: mutate,
	});

	onCleanup(() => {
		subscription.unsubscribe();
	});

	return infoResource;
}
