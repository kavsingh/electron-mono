import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

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

const Pulse = styled.div<{ durationMs?: number }>`
  opacity: 0;
  animation: ${pulse} ${({ durationMs = 1200 }) => durationMs}ms ease-out
    forwards;
`;

export default Pulse;
