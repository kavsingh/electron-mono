import { useEffect, useState } from "react";

import Button from "#renderer/components/button";
import Card from "#renderer/components/card";
import useFileDrop from "#renderer/hooks/use-file-drop";
import useFileSelectDialog from "#renderer/hooks/use-file-select-dialog";
import Page from "#renderer/layouts/page";
import { tv } from "#renderer/lib/style";

export default function Files() {
	const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

	function handleFileSelect(selected: string[]) {
		setSelectedFiles((current) => current.concat(selected));
	}

	return (
		<>
			<Page.Header>Files</Page.Header>
			<Page.Content>
				<DialogFileSelect onSelect={handleFileSelect} />
				<DragFileSelect onSelect={handleFileSelect} />
				<Card.Root>
					<Card.Header>
						<Card.Title>Selected files</Card.Title>
					</Card.Header>
					<Card.Content>
						<ul className="flex flex-col gap-1">
							{selectedFiles.map((file, i) => (
								<li
									key={i}
									className="flex gap-2 border-b border-border pb-2 text-sm text-muted-foreground last:border-b-0 last:pb-0"
								>
									{file}
								</li>
							))}
						</ul>
					</Card.Content>
				</Card.Root>
			</Page.Content>
		</>
	);
}

function DialogFileSelect({
	onSelect,
}: {
	onSelect: (selected: string[]) => void;
}) {
	const [files, selectFiles] = useFileSelectDialog();

	useEffect(() => {
		onSelect(files);
	}, [files, onSelect]);

	return (
		<Button
			onClick={() => {
				selectFiles();
			}}
		>
			Select files
		</Button>
	);
}

function DragFileSelect({
	onSelect,
}: {
	onSelect: (selected: string[]) => void;
}) {
	const [{ files, isActive }, dragDropHandlers] = useFileDrop();

	useEffect(() => {
		const filePaths = files?.map(({ file, isDirectory }) => {
			// @TODO: full file path still available
			return `${file.webkitRelativePath} (${isDirectory ? "directory" : "file"})`;
		});

		onSelect(filePaths ?? []);
	}, [files, onSelect]);

	return (
		<div className={dragFileSelectVariants({ isActive })} {...dragDropHandlers}>
			Drop files
		</div>
	);
}

const dragFileSelectVariants = tv({
	base: "my-3 grid h-[200px] place-items-center rounded-md border border-border text-muted-foreground transition-colors",
	variants: {
		isActive: {
			true: "border-foreground bg-accent/20 text-foreground",
		},
	},
});
