import { createTRPCReact } from "@trpc/react-query";

// eslint-disable-next-line import-x/no-restricted-paths
import type { AppRouter } from "#main/trpc/router";

export const trpc = createTRPCReact<AppRouter>();
