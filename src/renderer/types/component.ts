import type { FC } from 'react';

export type FCWithoutChildren<P = Record<string, unknown>> = FC<
  P & { children?: never }
>;
