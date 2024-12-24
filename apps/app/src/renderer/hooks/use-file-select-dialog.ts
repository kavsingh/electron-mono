import { createSignal } from "solid-js";

import { tipc } from "#renderer/tipc";

export default function useFileSelectDialog() {
	const [files, setFiles] = createSignal<string[]>([]);

	async function showDialog(options?: Options) {
		const response = await tipc.showOpenDialog.mutate({
			properties: ["openFile", "multiSelections"],
			...options,
		});

		setFiles(response.filePaths);
	}

	return [files, showDialog] as const;
}

type Options = Parameters<typeof tipc.showOpenDialog.mutate>[0];
