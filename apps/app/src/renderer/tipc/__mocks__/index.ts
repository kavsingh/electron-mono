import { vi } from "vitest";

import { createMockOpenDialogReturnValue } from "#common/__test-helpers__/mock-data-creators/electron";
import {
	createMockSystemInfo,
	createMockSystemStats,
} from "#common/__test-helpers__/mock-data-creators/system";
import { themeSourceSchema } from "#common/lib/theme";

import type { tipc as tipcActual } from "../index";

const defaultThemeSource = themeSourceSchema.parse("dark");

export const tipc: typeof tipcActual = {
	getThemeSource: {
		query: vi.fn(() => Promise.resolve(defaultThemeSource)),
	},
	setThemeSource: { mutate: vi.fn((source) => Promise.resolve(source)) },
	getSystemInfo: {
		query: vi.fn(() => Promise.resolve(createMockSystemInfo())),
	},
	getSystemStats: {
		query: vi.fn(() => Promise.resolve(createMockSystemStats())),
	},
	showOpenDialog: {
		mutate: vi.fn(() => Promise.resolve(createMockOpenDialogReturnValue())),
	},
	systemStatsEvent: { subscribe: vi.fn(() => () => undefined) },
};
