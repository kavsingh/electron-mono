import { useCallback, useState } from "react";
import styled from "@emotion/styled";

import type { DragEventHandler, VoidFunctionComponent } from "react";

const Files: VoidFunctionComponent = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isActive, setIsActive] = useState(false);

  const handleDragOver = useCallback<DragEventHandler<HTMLDivElement>>(
    (event) => {
      // needed for drop handler
      event.preventDefault();
    },
    []
  );

  const handleDragEnter = useCallback(() => {
    setIsActive(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsActive(false);
  }, []);

  const handleDrop = useCallback<DragEventHandler<HTMLDivElement>>((event) => {
    setFiles((current) => [
      ...current,
      ...Array.from(event.dataTransfer.files).filter(
        (file) => !current.find((c) => c.path === file.path)
      ),
    ]);
    setIsActive(false);
  }, []);

  return (
    <div>
      <h2>Files</h2>
      <DropRegion
        isActive={isActive}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      />
      <ul>
        {files.map((file) => (
          <li key={file.path}>
            <span>{file.path}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Files;

const DropRegion = styled.div<{ isActive: boolean }>`
  height: 200px;
  border: 1px solid ${({ theme }) => theme.colors.keyline};
  background-color: ${({ theme, isActive }) =>
    isActive ? `${theme.colors.keyline}88` : "transparent"};
`;
