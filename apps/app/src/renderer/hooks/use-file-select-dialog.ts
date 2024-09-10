import { useState } from "react";

import { trpc } from "#renderer/trpc";

export default function useFileSelectDialog() {
	const [files, setFiles] = useState<string[]>([]);
	const { mutate } = trpc.showOpenDialog.useMutation({
		onSuccess(result) {
			setFiles(result.filePaths);
		},
	});

	return [files, mutate] as const;
}
