import { A } from "@solidjs/router";
import { createSignal, onCleanup } from "solid-js";

import { useTRPCClient } from "~/renderer/contexts/trpc-client";

import Pulse from "./pulse";
import StatusBadge from "./status-badge";
import ThemeSwitch from "./theme-switch";

export default function Masthead() {
	const [timestamp, setTimestamp] = createSignal(0);
	const subscription = useTRPCClient().heartbeatEvent.subscribe(undefined, {
		onData(data) {
			setTimestamp(data.timestamp);
		},
	});

	onCleanup(() => subscription.unsubscribe());

	return (
		<div class="flex flex-col gap-2">
			<div class="flex items-center gap-4">
				<nav class="flex items-center gap-2">
					<A href="/">System Info</A>
					<A href="/files">Files</A>
				</nav>
				<div class="me-0 ms-auto">
					<Pulse trigger={timestamp}>
						<StatusBadge>OK</StatusBadge>
					</Pulse>
				</div>
			</div>
			<ThemeSwitch />
		</div>
	);
}
