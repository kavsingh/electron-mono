import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import bridge from "~/renderer/bridge";

import Pulse from "./pulse";
import StatusBadge from "./status-badge";

import type { FC } from "react";

const Masthead: FC = () => {
  const [status, setStatus] = useState("");
  const [timestamp, setTimestamp] = useState("");

  useEffect(
    () =>
      bridge.subscribeHealth((event) => {
        setStatus(event.status);
        setTimestamp(event.timestamp.toString());
      }),
    []
  );

  return (
    <Container>
      <Nav>
        <Link to="/">USB Devices</Link>
        <Link to="/files">Files</Link>
      </Nav>
      <Pulse key={timestamp}>
        <StatusBadge>{status}</StatusBadge>
      </Pulse>
    </Container>
  );
};

export default Masthead;

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
