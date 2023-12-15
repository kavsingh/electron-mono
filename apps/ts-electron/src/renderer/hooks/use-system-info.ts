import { createQuery } from "@merged/solid-apollo";

import { SystemInfoDocument } from "./system-info-query.generated";

import type { SystemInfoQuery } from "./system-info-query.generated";

export default function useSystemInfo() {
	const infoResource = createQuery<SystemInfoQuery>(
		// @ts-expect-error upstream types
		SystemInfoDocument,
	);
	// const subscription = client.systemInfoEvent.subscribe(undefined, {
	// 	onData: mutate,
	// });

	// onCleanup(() => subscription.unsubscribe());

	return infoResource;
}
