import { createEffect, createSignal, For } from "solid-js";

import { Button } from "#renderer/components/button";
import { Card } from "#renderer/components/card";
import { useFileDrop } from "#renderer/hooks/use-file-drop";
import { useFileSelectDialog } from "#renderer/hooks/use-file-select-dialog";
import { Page } from "#renderer/layouts/page";
import { tv } from "#renderer/lib/style";

function DialogFileSelect(props: { onSelect: (selected: string[]) => void }) {
	const [files, selectFiles] = useFileSelectDialog();

	createEffect(() => {
		props.onSelect(files());
	});

	return <Button onClick={() => void selectFiles()}>Select files</Button>;
}

const dragFileSelectVariants = tv({
	base: "my-3 grid h-50 place-items-center rounded-md border border-border text-muted-foreground transition-colors",
	variants: {
		isActive: {
			true: "border-foreground bg-accent/20 text-foreground",
		},
	},
});

function DragFileSelect(props: { onSelect: (selected: string[]) => void }) {
	const [{ files, isActive }, dragDropHandlers] = useFileDrop();

	createEffect(() => {
		const filePaths = files()?.map(({ file, isDirectory }) => {
			// @TODO: full file path still available
			return `${file.webkitRelativePath} (${isDirectory ? "directory" : "file"})`;
		});

		props.onSelect(filePaths ?? []);
	});

	return (
		<div
			class={dragFileSelectVariants({ isActive: isActive() })}
			{...dragDropHandlers}
		>
			Drop files
		</div>
	);
}

export function Files() {
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
				<Card.Root>
					<Card.Header>
						<Card.Title>Selected files</Card.Title>
					</Card.Header>
					<Card.Content>
						<ul class="flex flex-col gap-1">
							<For each={selectedFiles()}>
								{(file) => (
									<li class="flex gap-2 border-b border-border pb-2 text-sm text-muted-foreground last:border-b-0 last:pb-0">
										{file}
									</li>
								)}
							</For>
						</ul>
					</Card.Content>
				</Card.Root>
			</Page.Content>
		</>
	);
}
