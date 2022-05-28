import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

import type { ComponentProps, FC } from "react";

const Pulse: FC<ComponentProps<typeof Container>> = ({
  children,
  ...containerProps
}) => <Container {...containerProps}>{children}</Container>;

export default Pulse;

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

const Container = styled.div<{ durationMs?: number }>`
  opacity: 0;
  animation: ${pulse} ${({ durationMs = 1200 }) => durationMs}ms ease-out;
`;
