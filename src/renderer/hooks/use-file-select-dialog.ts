import { createSignal } from "solid-js";

import { useTRPCClient } from "~/renderer/contexts/trpc-client";

export default function useFileSelectDialog() {
	const client = useTRPCClient();
	const [files, setFiles] = createSignal<string[]>([]);

	async function showDialog(options?: Options) {
		const selectResult = await client.showOpenDialog.query({
			properties: ["openFile", "multiSelections"],
			...options,
		});

		setFiles(selectResult.filePaths);
	}

	return [files, showDialog] as const;
}

type Options = Parameters<
	ReturnType<typeof useTRPCClient>["showOpenDialog"]["query"]
>[0];
