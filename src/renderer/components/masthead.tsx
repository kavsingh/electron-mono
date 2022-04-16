import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

import bridge from "~/renderer/bridge";

import type { FC } from "react";

const Masthead: FC = () => {
  const [status, setStatus] = useState("");
  const [statusKey, setStatusKey] = useState(Date.now());

  useEffect(
    () =>
      bridge.subscribeHealth((event) => {
        setStatus(event.status);
        setStatusKey(Date.now());
      }),
    []
  );

  return (
    <Container>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/devices">Devices</Link>
        <Link to="/files">Files</Link>
      </nav>
      <Status key={statusKey}>{status}</Status>
    </Container>
  );
};

export default Masthead;

const pulse = keyframes`
  0% {
    opacity: 0;
  }

  10% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Status = styled.div`
  padding: 0.2em;
  color: ${({ theme }) => theme.colors.background};
  background-color: ${({ theme }) => theme.colors.bodyText};
  opacity: 0;
  animation: ${pulse} 1.2s ease-out;
`;
