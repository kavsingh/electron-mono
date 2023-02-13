import { createEffect, createSignal, For } from "solid-js";

import Button from "~/renderer/components/button";
import PageHeader from "~/renderer/components/page-header";
import useFileDrop from "~/renderer/hooks/use-file-drop";
import useFileSelectDialog from "~/renderer/hooks/use-file-select-dialog";

import type { Component } from "solid-js";

const Files: Component = () => {
	const [selectedFiles, setSelectedFiles] = createSignal<string[]>([]);

	function handleFileSelect(selected: string[]) {
		setSelectedFiles((current) => current.concat(selected));
	}

	return (
		<>
			<PageHeader>Files</PageHeader>
			<DialogFileSelect onSelect={handleFileSelect} />
			<DragFileSelect onSelect={handleFileSelect} />
			<ul class="m-0 flex list-none flex-col gap-1 p-0 text-sm">
				<For each={selectedFiles()}>
					{(file) => (
						<li class="pbe-1 border-be border-be-100 last:pbe-0 last:border-be-0">
							{file}
						</li>
					)}
				</For>
			</ul>
		</>
	);
};

export default Files;

const DialogFileSelect: Component<{
	onSelect: (selected: string[]) => void;
}> = (props) => {
	const [files, selectFiles] = useFileSelectDialog();

	createEffect(() => props.onSelect(files()));

	return <Button onClick={() => void selectFiles()}>Select files</Button>;
};

const DragFileSelect: Component<{
	onSelect: (selected: string[]) => void;
}> = (props) => {
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
			class="border border-100 bs-[200px]"
			classList={{ "border-current": isActive() }}
			{...dragDropHandlers}
		/>
	);
};
