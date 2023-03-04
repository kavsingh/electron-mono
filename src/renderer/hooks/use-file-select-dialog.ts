import { createSignal } from "solid-js";

import { getTRPCClient } from "~/renderer/trpc/client";

export default function useFileSelectDialog() {
	const [files, setFiles] = createSignal<string[]>([]);

	async function showDialog(options?: Options) {
		const selectResult = await getTRPCClient().showOpenDialog.query({
			properties: ["openFile", "multiSelections"],
			...options,
		});

		setFiles(selectResult.filePaths);
	}

	return [files, showDialog] as const;
}

type Options = Parameters<
	ReturnType<typeof getTRPCClient>["showOpenDialog"]["query"]
>[0];
