import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

import type { FCWithoutChildren } from "../types/component";

const Masthead: FCWithoutChildren = () => {
  const [status, setStatus] = useState<string>("");
  const [statusKey, setStatusKey] = useState<number>(Math.random());

  useEffect(() => {
    const unsubscribe = window.bridge.subscribeHealth((event) => {
      setStatus(event.status);
      setStatusKey(Math.random());
    });

    return unsubscribe;
  }, []);

  return (
    <Container>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/devices">Devices</Link>
      </nav>
      <Status key={statusKey}>{status}</Status>
    </Container>
  );
};

export default Masthead;

const pulse = keyframes`
  from {
    opacity: 1;
  }

  to {
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
  animation: ${pulse} 0.6s ease-out;
`;
