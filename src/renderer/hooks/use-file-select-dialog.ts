import { createSignal } from "solid-js";

import { getTRPCClient } from "~/renderer/trpc/client";

export default function useFileSelectDialog() {
	const [files, setFiles] = createSignal<string[]>([]);

	async function showDialog() {
		const selectResult = await getTRPCClient().showOpenDialog.query({
			properties: ["openFile", "multiSelections"],
		});

		setFiles(selectResult.filePaths);
	}

	return [files, showDialog] as const;
}
