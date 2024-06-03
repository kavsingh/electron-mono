import { vi } from "vitest";

import { createMockOpenDialogReturnValue } from "#common/__test-helpers__/mock-data-creators/electron";
import {
	createMockSystemInfo,
	createMockSystemStats,
} from "#common/__test-helpers__/mock-data-creators/system";

import type { trpc as trpcActual } from "..";

export const trpc: typeof trpcActual = {
	themeSource: {
		query: vi.fn(() => Promise.resolve("dark")),
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
	showEmbeddedWebView: {
		mutate: vi.fn(() => Promise.resolve(1)),
	},
	updateEmbeddedWebView: {
		mutate: vi.fn(() => Promise.resolve()),
	},
	removeEmbeddedWebView: {
		mutate: vi.fn(() => Promise.resolve()),
	},
	systemStatsEvent: { subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })) },
};
