import { createResource, Show } from "solid-js";

export default function HostInfo() {
	const [hostInfo] = createResource(fetchSystemInfo);

	return (
		<Show when={hostInfo()}>
			{(info) => (
				<dl class="mx-auto grid w-8/12 grid-cols-[max-content_1fr] gap-x-4 rounded-md border border-white/20 p-4 text-left">
					<dt class="text-neutral-700 dark:text-neutral-500">OS name</dt>
					<dd>{info().osName}</dd>
					<dt class="text-neutral-700 dark:text-neutral-500">OS version</dt>
					<dd>{info().osVersion}</dd>
				</dl>
			)}
		</Show>
	);
}

function fetchSystemInfo() {
	if (typeof window === "undefined") {
		return Promise.resolve({ osName: "-", osVersion: "-" });
	}

	return window.__BRIDGE__.getSystemInfo();
}
