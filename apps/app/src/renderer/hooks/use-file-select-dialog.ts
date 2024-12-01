import { createSignal } from "solid-js";

import { tipc } from "#renderer/tipc";

export default function useFileSelectDialog() {
	const [files, setFiles] = createSignal<string[]>([]);

	async function showDialog(options?: Options) {
		const selectResult = await tipc.invoke.showOpenDialog({
			properties: ["openFile", "multiSelections"],
			...options,
		});

		setFiles(selectResult.filePaths);
	}

	return [files, showDialog] as const;
}

type Options = Parameters<typeof tipc.invoke.showOpenDialog>[0];
