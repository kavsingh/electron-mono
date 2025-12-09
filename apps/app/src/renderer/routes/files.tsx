import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Button } from "~/renderer/components/button";
import { Card } from "~/renderer/components/card";
import { useFileDrop } from "~/renderer/hooks/files";
import { Page } from "~/renderer/layouts/page";
import { tv } from "~/renderer/lib/style";
import { trpc } from "~/renderer/trpc";

function DialogFileSelect({
	onSelect,
}: {
	onSelect: (selected: string[]) => void;
}) {
	const { mutate } = trpc.showOpenDialog.useMutation({
		onSuccess(result) {
			onSelect(result.filePaths);
		},
	});

	return (
		<Button
			onClick={() => mutate({ properties: ["openFile", "multiSelections"] })}
		>
			Select files
		</Button>
	);
}

const dragFileSelectVariants = tv({
	base: "my-3 grid h-50 place-items-center rounded-md border border-border text-muted-foreground transition-colors",
	variants: {
		isActive: {
			true: "border-foreground bg-accent/20 text-foreground",
		},
	},
});

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

function Files() {
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
							{selectedFiles.map((file) => (
								<li
									key={file}
									className="flex gap-2 border-be border-border pbe-2 text-sm text-muted-foreground last:border-be-0 last:pbe-0"
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

export const Route = createFileRoute("/files")({ component: Files });
