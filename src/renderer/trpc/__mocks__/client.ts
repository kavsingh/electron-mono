import { vi } from "vitest";

import { createMockOpenDialogReturnValue } from "~/common/__test-helpers__/mock-data-creators/electron";
import { createMockSystemInfo } from "~/common/__test-helpers__/mock-data-creators/system-info";

import type { AppTRPCClient } from "../client";

const mockClient: AppTRPCClient = {
	systemInfo: {
		query: vi.fn(() => Promise.resolve(createMockSystemInfo())),
	},
	showOpenDialog: {
		query: vi.fn(() => Promise.resolve(createMockOpenDialogReturnValue())),
	},
	heartbeat: { subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })) },
};

export function getTRPCClient() {
	return mockClient;
}
