import { vi } from "vitest";

import { createMockOpenDialogReturnValue } from "#common/__test-helpers__/mock-data-creators/electron";
import {
	createMockSystemInfo,
	createMockSystemStats,
} from "#common/__test-helpers__/mock-data-creators/system";
import { themeSourceSchema } from "#common/lib/theme";

import type { trpc as trpcActual } from "../index";

const defaultThemeSource = themeSourceSchema.parse("dark");

export const trpc: MockTrpc = {
	themeSource: {
		query: vi.fn(() => Promise.resolve(defaultThemeSource)),
	},
	setThemeSource: {
		mutate: vi.fn((source) => Promise.resolve(source)),
	},
	systemInfo: {
		query: vi.fn(() => Promise.resolve(createMockSystemInfo())),
	},
	systemStats: {
		query: vi.fn(() => Promise.resolve(createMockSystemStats())),
	},
	showOpenDialog: {
		query: vi.fn(() => Promise.resolve(createMockOpenDialogReturnValue())),
	},
	systemStatsEvent: { subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })) },
};

type MockTrpc = {
	[K in Exclude<keyof typeof trpcActual, symbol>]: (typeof trpcActual)[K];
};
