import { vi } from "vitest";

import { createMockOpenDialogReturnValue } from "~/common/__test-helpers__/mock-data-creators/electron";
import { createMockSystemInfo } from "~/common/__test-helpers__/mock-data-creators/system-info";

import type { AppTRPCClient } from "../client";

const mockClient: AppTRPCClient = {
	themeSource: {
		query: vi.fn(() => Promise.resolve("dark")),
	},
	setThemeSource: {
		mutate: vi.fn(() => Promise.resolve()),
	},
	systemInfo: {
		query: vi.fn(() => Promise.resolve(createMockSystemInfo())),
	},
	showOpenDialog: {
		query: vi.fn(() => Promise.resolve(createMockOpenDialogReturnValue())),
	},
	systemInfoEvent: { subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })) },
	heartbeatEvent: { subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })) },
};

export function getTRPCClient() {
	return mockClient;
}
