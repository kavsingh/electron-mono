import { createEffect, createSignal, For } from "solid-js";

import Button from "~/renderer/components/button";
import useFileDrop from "~/renderer/hooks/use-file-drop";
import useFileSelectDialog from "~/renderer/hooks/use-file-select-dialog";
import Page from "~/renderer/layouts/page";

export default function Files() {
	const [selectedFiles, setSelectedFiles] = createSignal<string[]>([]);

	function handleFileSelect(selected: string[]) {
		setSelectedFiles((current) => current.concat(selected));
	}

	return (
		<Page.Root>
			<Page.Header>Files</Page.Header>
			<Page.Content>
				<DialogFileSelect onSelect={handleFileSelect} />
				<DragFileSelect onSelect={handleFileSelect} />
				<ul class="m-0 flex list-none flex-col gap-1 p-0 text-sm">
					<For each={selectedFiles()}>
						{(file) => (
							<li class="border-b border-b-neutral-800 pb-1 last:border-b-0 last:pb-0 dark:border-b-neutral-300">
								{file}
							</li>
						)}
					</For>
				</ul>
			</Page.Content>
		</Page.Root>
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
			class="h-[200px] border border-neutral-300 dark:border-neutral-700"
			classList={{ "border-current": isActive() }}
			{...dragDropHandlers}
		/>
	);
}
