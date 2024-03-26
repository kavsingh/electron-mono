import { createResource, Show, For } from "solid-js";

export default function HostInfo() {
	const [systemInfo] = createResource(fetchSystemInfo);
	const [files] = createResource(fetchUserFiles);

	return (
		<>
			<Show when={systemInfo()}>
				{(info) => (
					<dl>
						<dt>OS name</dt>
						<dd>{info().osName}</dd>
						<dt>OS version</dt>
						<dd>{info().osVersion}</dd>
					</dl>
				)}
			</Show>
			<Show when={files()}>
				{(list) => (
					<ul>
						<For each={list()}>{(file) => <li>{file}</li>}</For>
					</ul>
				)}
			</Show>
		</>
	);
}

function fetchSystemInfo() {
	if (typeof window === "undefined") {
		return Promise.resolve({ osName: "-", osVersion: "-" });
	}

	return window.__BRIDGE__.getSystemInfo();
}

function fetchUserFiles() {
	if (typeof window === "undefined") {
		return Promise.resolve([]);
	}

	return window.__BRIDGE__.getUserFiles();
}
