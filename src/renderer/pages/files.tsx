import { createEffect, createSignal, For } from "solid-js";
import { twMerge } from "tailwind-merge";

import Button from "#renderer/components/button";
import useFileDrop from "#renderer/hooks/use-file-drop";
import useFileSelectDialog from "#renderer/hooks/use-file-select-dialog";
import Page from "#renderer/layouts/page";

export default function Files() {
	const [selectedFiles, setSelectedFiles] = createSignal<string[]>([]);

	function handleFileSelect(selected: string[]) {
		setSelectedFiles((current) => current.concat(selected));
	}

	return (
		<>
			<Page.Header>Files</Page.Header>
			<Page.Content>
				<DialogFileSelect onSelect={handleFileSelect} />
				<DragFileSelect onSelect={handleFileSelect} />
				<ul class="flex flex-col gap-1">
					<For each={selectedFiles()}>
						{(file) => (
							<li class="flex gap-2 border-b border-b-neutral-200 pb-2 text-neutral-700 last:border-b-0 last:pb-0 dark:border-b-neutral-700 dark:text-neutral-400">
								{file}
							</li>
						)}
					</For>
				</ul>
			</Page.Content>
		</>
	);
}

function DialogFileSelect(props: { onSelect: (selected: string[]) => void }) {
	const [files, selectFiles] = useFileSelectDialog();

	createEffect(() => {
		props.onSelect(files());
	});

	return <Button onClick={() => void selectFiles()}>Select files</Button>;
}

function DragFileSelect(props: { onSelect: (selected: string[]) => void }) {
	const [{ files, isActive }, dragDropHandlers] = useFileDrop();

	createEffect(() => {
		const filePaths = files()?.map(
			({ file, isDirectory }) =>
				`${file.path} (${isDirectory ? "directory" : "file"})`,
		);

		props.onSelect(filePaths ?? []);
	});

	return (
		<div
			class={twMerge(
				"my-3 grid h-[200px] place-items-center rounded-lg border border-neutral-300 text-neutral-600 transition-colors dark:border-neutral-700 dark:text-neutral-400",
				isActive() &&
					"border-black bg-black/10 text-black dark:border-white dark:bg-white/10 dark:text-white",
			)}
			{...dragDropHandlers}
		>
			Drop files
		</div>
	);
}
