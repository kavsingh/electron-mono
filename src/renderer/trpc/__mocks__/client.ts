import { vi } from "vitest";

import type { AppTRPCClient } from "../client";

const mockClient: AppTRPCClient = {
	systemInfo: {
		// @ts-expect-error TODO: resolve type mismatch
		query: vi.fn(() =>
			Promise.resolve({
				os: "OS",
				freeMemory: BigInt(50),
				totalMemory: BigInt(100),
			}),
		),
	},
	heartbeat: { subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })) },
};

export const getTRPCClient = () => mockClient;
