import { For } from "solid-js";
import { styled } from "solid-styled-components";

import { useFileDrop } from "~/renderer/hooks/file";

import type { Component } from "solid-js";
import type { DroppedFile } from "~/renderer/hooks/file";

const Files: Component = () => {
	const [{ files, isActive }, elementHandles] = useFileDrop();

	return (
		<div>
			<h2>Files</h2>
			<DropRegion isActive={isActive()} {...elementHandles} />
			<ul>
				<For each={files()}>
					{(droppedFile) => <FileItem {...droppedFile} />}
				</For>
			</ul>
		</div>
	);
};

export default Files;

const FileItem: Component<DroppedFile> = (props) => (
	<li>
		<span>{props.file.path}</span> ({props.isDirectory ? "directory" : "file"})
	</li>
);

const DropRegion = styled.div<{ isActive: boolean }>`
	block-size: 200px;
	border: 1px solid ${(props) => props.theme?.colors.text[100]};
	background-color: ${(props) =>
		props.isActive
			? `${props.theme?.colors.text[100] ?? ""}88`
			: "transparent"};
`;
