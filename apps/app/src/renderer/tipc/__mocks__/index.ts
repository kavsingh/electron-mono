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
	invoke: {
		getThemeSource: vi.fn(() => Promise.resolve(defaultThemeSource)),
		setThemeSource: vi.fn((source) => Promise.resolve(source)),
		getSystemInfo: vi.fn(() => Promise.resolve(createMockSystemInfo())),
		getSystemStats: vi.fn(() => Promise.resolve(createMockSystemStats())),
		showOpenDialog: vi.fn(() =>
			Promise.resolve(createMockOpenDialogReturnValue()),
		),
	},

	subscribe: {
		systemStatsEvent: vi.fn(() => () => undefined),
	},

	publish: {},
};
