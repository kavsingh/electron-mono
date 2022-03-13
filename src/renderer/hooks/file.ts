import { useCallback, useMemo, useState } from "react";

import type { DragEventHandler } from "react";

export const useFileDrop = (onFiles: (files: DroppedFile[]) => unknown) => {
  const [isActive, setIsActive] = useState(false);

  const onDragOver = useCallback<DragEventHandler>((event) => {
    // needed for drop handler
    event.preventDefault();
  }, []);

  const onDragEnter = useCallback<DragEventHandler>((event) => {
    // needed for drop handler
    event.preventDefault();
    setIsActive(true);
  }, []);

  const onDragLeave = useCallback<DragEventHandler>(() => {
    setIsActive(false);
  }, []);

  const onDrop = useCallback<DragEventHandler>(
    (event) => {
      const { items, files } = event.dataTransfer;
      const entries = Array.from(items).map((item) => item.webkitGetAsEntry());
      const droppedFiles = Array.from(files).map((file) => {
        const { isDirectory, isFile } =
          entries.find((e) => e?.name === file.name) ?? {};

        return { file, isDirectory, isFile };
      });

      setIsActive(false);
      onFiles(droppedFiles);
    },
    [onFiles]
  );

  const elementHandles = useMemo(
    () => ({ onDragOver, onDragEnter, onDragLeave, onDrop }),
    [onDragEnter, onDragLeave, onDragOver, onDrop]
  );

  return { isActive, elementHandles } as const;
};

export interface DroppedFile
  extends Partial<Pick<FileSystemEntry, "isDirectory" | "isFile">> {
  file: File;
}

export type DroppedFileHandler = (files: DroppedFile[]) => unknown;