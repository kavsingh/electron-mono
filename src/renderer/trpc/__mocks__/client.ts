import { vi } from "vitest";

import { createMockSystemInfo } from "~/common/__test-helpers__/mock-data-creators/system-info";

import type { AppTRPCClient } from "../client";

const mockClient: AppTRPCClient = {
	systemInfo: {
		// @ts-expect-error TODO: resolve type mismatch
		query: vi.fn(() => Promise.resolve(createMockSystemInfo())),
	},
	heartbeat: { subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })) },
};

export function getTRPCClient() {
	return mockClient;
}
