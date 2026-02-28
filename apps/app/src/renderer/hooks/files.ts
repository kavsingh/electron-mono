import { createSignal } from "solid-js";

import { trpc } from "#renderer/trpc";

import type { JSX } from "solid-js";

type DragEventHandler = JSX.EventHandlerUnion<HTMLElement, DragEvent>;

export interface DroppedFile {
	isDirectory: FileSystemEntry["isDirectory"] | undefined;
	isFile: FileSystemEntry["isFile"] | undefined;
	file: File;
}

const onDragOver: DragEventHandler = (event) => {
	event.preventDefault();
};

export function useFileDrop() {
	const [droppedFiles, setDroppedFiles] = createSignal<DroppedFile[]>();
	const [isActive, setIsActive] = createSignal(false);

	const onDragEnter: DragEventHandler = (event) => {
		event.preventDefault();
		setIsActive(true);
	};

	const onDragLeave: DragEventHandler = () => {
		setIsActive(false);
	};

	const onDrop: DragEventHandler = (event) => {
		event.preventDefault();

		const { items, files } = event.dataTransfer ?? {};
		const entries = items
			? Array.from(items).map((item) => item.webkitGetAsEntry())
			: [];
		const dropped = files
			? Array.from(files).map((file) => {
					const { isDirectory, isFile } =
						entries.find((e) => e?.name === file.name) ?? {};

					return { file, isDirectory, isFile };
				})
			: [];

		setIsActive(false);
		setDroppedFiles(dropped);
	};

	return [
		{ isActive, files: droppedFiles },
		{ onDragOver, onDragEnter, onDragLeave, onDrop },
	] as const;
}

export type ShowDialogOptions = Parameters<
	(typeof trpc)["showOpenDialog"]["query"]
>[0];

export function useFileSelectDialog() {
	const [files, setFiles] = createSignal<string[]>([]);

	async function showDialog(options?: ShowDialogOptions) {
		const selectResult = await trpc.showOpenDialog.query({
			properties: ["openFile", "multiSelections"],
			...options,
		});

		setFiles(selectResult.filePaths);
	}

	return [files, showDialog] as const;
}
