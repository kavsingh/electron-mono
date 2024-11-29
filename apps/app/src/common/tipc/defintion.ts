import type { TIPCDefinitions } from "tipc";

export type AppTIPCDefinitions = TIPCDefinitions<TIPCInvoke>;

type TIPCInvoke = {
	ping: [undefined, string];
};
