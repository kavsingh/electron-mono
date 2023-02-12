import { For } from "solid-js";

import PageHeader from "~/renderer/components/page-header";
import useFileDrop from "~/renderer/hooks/use-file-drop";

import type { Component } from "solid-js";
import type { DroppedFile } from "~/renderer/hooks/use-file-drop";

const Files: Component = () => {
	const [{ files, isActive }, elementHandles] = useFileDrop();

	return (
		<>
			<PageHeader>Files</PageHeader>
			<div
				class="border border-100 bs-[200px]"
				classList={{ "border-400": isActive() }}
				{...elementHandles}
			/>
			<ul>
				<For each={files()}>
					{(droppedFile) => <FileItem {...droppedFile} />}
				</For>
			</ul>
		</>
	);
};

export default Files;

const FileItem: Component<DroppedFile> = (props) => (
	<li>
		<span>{props.file.path}</span> ({props.isDirectory ? "directory" : "file"})
	</li>
);
