import { A } from "@solidjs/router";
import { createSignal, onCleanup } from "solid-js";

import Pulse from "./pulse";
import StatusBadge from "./status-badge";
import { getTRPCClient } from "../trpc/client";

export default function Masthead() {
	const [timestamp, setTimestamp] = createSignal("");
	const subscription = getTRPCClient().heartbeat.subscribe(undefined, {
		onData: () => {
			setTimestamp(String(Date.now()));
		},
	});

	onCleanup(() => subscription.unsubscribe());

	return (
		<div class="flex items-center justify-between">
			<nav class="flex items-center gap-2">
				<A href="/">System Info</A>
				<A href="/files">Files</A>
			</nav>
			<Pulse trigger={timestamp}>
				<StatusBadge>OK</StatusBadge>
			</Pulse>
		</div>
	);
}
