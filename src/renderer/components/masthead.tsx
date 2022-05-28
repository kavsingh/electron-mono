import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import bridge from "~/renderer/bridge";

import type { FC } from "react";

const Masthead: FC = () => {
  const [status, setStatus] = useState("");
  const [statusKey, setStatusKey] = useState("");

  useEffect(
    () =>
      bridge.subscribeHealth((event) => {
        setStatus(event.status);
        setStatusKey(event.timestamp.toString());
      }),
    []
  );

  return (
    <Container>
      <Nav>
        <Link to="/">USB Devices</Link>
        <Link to="/files">Files</Link>
      </Nav>
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

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.fixed[0]};
`;

const Status = styled.div`
  padding: 0.2em;
  color: ${({ theme }) => theme.color.surface[0]};
  background-color: ${({ theme }) => theme.color.text[400]};
  opacity: 0;
  animation: ${pulse} 1.2s ease-out;
`;
