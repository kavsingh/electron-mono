import { createMutation } from "@merged/solid-apollo";
import { createSignal } from "solid-js";

import { ShowOpenDialogDocument } from "./show-open-dialog-mutation.generated";

import type { ElectronOpenDialogOptions } from "#renderer/graphql/__generated__/types";
import type { ShowOpenDialogMutation } from "./show-open-dialog-mutation.generated";

export default function useFileSelectDialog() {
	const [showOpenDialog] = createMutation<ShowOpenDialogMutation>(
		// @ts-expect-error upstream
		ShowOpenDialogDocument,
	);
	const [files, setFiles] = createSignal<string[]>([]);

	async function showDialog(options?: ElectronOpenDialogOptions) {
		const result = await showOpenDialog({
			variables: {
				options: {
					properties: ["openFile", "multiSelections"],
					...options,
				},
			},
		});

		setFiles(result.showOpenDialog.filePaths);
	}

	return [files, showDialog] as const;
}
