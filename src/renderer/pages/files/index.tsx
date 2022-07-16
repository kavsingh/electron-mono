import styled from "@emotion/styled";
import { useEffect, useState } from "react";

import { useFileDrop } from "~/renderer/hooks/file";

import type { FC } from "react";
import type { DroppedFile } from "~/renderer/hooks/file";

const Files: FC = () => {
  const [{ files = [], isActive }, elementHandles] = useFileDrop();
  const [droppedFiles, setDroppedFiles] = useState<DroppedFile[]>(files);

  useEffect(() => {
    if (!files?.length) return;

    setDroppedFiles((current) => [
      ...current,
      ...files.filter(
        ({ file }) => !current.find((c) => c.file.path === file.path)
      ),
    ]);
  }, [files]);

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

const FileItem: FC<DroppedFile> = ({ file, isDirectory }) => (
  <li>
    <span>{file.path}</span> ({isDirectory ? "directory" : "file"})
  </li>
);

const DropRegion = styled.div<{ isActive: boolean }>`
  block-size: 200px;
  border: 1px solid ${({ theme }) => theme.color.text[100]};
  background-color: ${({ theme, isActive }) =>
    isActive ? `${theme.color.text[100]}88` : "transparent"};
`;
