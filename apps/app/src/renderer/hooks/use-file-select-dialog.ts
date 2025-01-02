import { createSignal } from "solid-js";

import { ipc } from "#renderer/ipc";

export default function useFileSelectDialog() {
	const [files, setFiles] = createSignal<string[]>([]);

	async function showDialog(options?: Options) {
		const response = await ipc.showOpenDialog.mutate({
			properties: ["openFile", "multiSelections"],
			...options,
		});

		setFiles(response.filePaths);
	}

	return [files, showDialog] as const;
}

type Options = Parameters<typeof ipc.showOpenDialog.mutate>[0];
