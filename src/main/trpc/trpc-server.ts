import { initTRPC } from "@trpc/server";
import SuperJSON from "superjson";

const trpc = initTRPC.create({ transformer: SuperJSON });

export const router = trpc.router;
export const publicProcedure = trpc.procedure;
