import { createSignal } from "solid-js";

export default function useFileDrop() {
	const [droppedFiles, setDroppedFiles] = createSignal<DroppedFile[]>();
	const [isActive, setIsActive] = createSignal(false);

	function onDragOver(event: DragEvent) {
		// needed for drop handler
		event.preventDefault();
	}

	function onDragEnter(event: DragEvent) {
		// needed for drop handler
		event.preventDefault();
		setIsActive(true);
	}

	function onDragLeave() {
		setIsActive(false);
	}

	function onDrop(event: DragEvent) {
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
	}

	return [
		{ isActive, files: droppedFiles },
		{ onDragOver, onDragEnter, onDragLeave, onDrop },
	] as const;
}

export type DroppedFile = {
	isDirectory: FileSystemEntry["isDirectory"] | undefined;
	isFile: FileSystemEntry["isFile"] | undefined;
	file: File;
};
