import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "#main/trpc/router";

export const trpc = createTRPCReact<AppRouter>();
