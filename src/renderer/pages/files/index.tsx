import { useCallback, useState } from "react";
import styled from "@emotion/styled";

import { useFileDrop } from "~/renderer/hooks/file";

import type { VoidFunctionComponent } from "react";
import type { DroppedFile, DroppedFileHandler } from "~/renderer/hooks/file";

const Files: VoidFunctionComponent = () => {
  const [droppedFiles, setDroppedFiles] = useState<DroppedFile[]>([]);
  const handleFiles = useCallback<DroppedFileHandler>((dropped) => {
    setDroppedFiles((current) => [
      ...current,
      ...dropped.filter(
        ({ file }) => !current.find((c) => c.file.path === file.path)
      ),
    ]);
  }, []);
  const { isActive, elementHandles } = useFileDrop(handleFiles);

  return (
    <div>
      <h2>Files</h2>
      <DropRegion isActive={isActive} {...elementHandles} />
      <ul>
        {droppedFiles.map((droppedFile) => (
          <FileItem key={droppedFile.file.path} {...droppedFile} />
        ))}
      </ul>
    </div>
  );
};

export default Files;

const FileItem: VoidFunctionComponent<DroppedFile> = ({
  file,
  isDirectory,
}) => (
  <li>
    <span>{file.path}</span> ({isDirectory ? "directory" : "file"})
  </li>
);

const DropRegion = styled.div<{ isActive: boolean }>`
  height: 200px;
  border: 1px solid ${({ theme }) => theme.colors.keyline};
  background-color: ${({ theme, isActive }) =>
    isActive ? `${theme.colors.keyline}88` : "transparent"};
`;
