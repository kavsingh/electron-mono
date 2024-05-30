import { useState } from "react";

import { trpc } from "#renderer/trpc";

export default function useFileSelectDialog() {
	const [files, setFiles] = useState<string[]>([]);

	async function showDialog(options?: Options) {
		const selectResult = await trpc.showOpenDialog.query({
			properties: ["openFile", "multiSelections"],
			...options,
		});

		setFiles(selectResult.filePaths);
	}

	return [files, showDialog] as const;
}

type Options = Parameters<(typeof trpc)["showOpenDialog"]["query"]>[0];
