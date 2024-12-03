import { createMockTIPCOkResult } from "tipc/test";
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
		invoke: vi.fn(() =>
			Promise.resolve(createMockTIPCOkResult(defaultThemeSource)),
		),
	},
	setThemeSource: { invoke: vi.fn((source) => Promise.resolve(source)) },
	getSystemInfo: {
		invoke: vi.fn(() =>
			Promise.resolve(createMockTIPCOkResult(createMockSystemInfo())),
		),
	},
	getSystemStats: {
		invoke: vi.fn(() =>
			Promise.resolve(createMockTIPCOkResult(createMockSystemStats())),
		),
	},
	showOpenDialog: {
		invoke: vi.fn(() =>
			Promise.resolve(
				createMockTIPCOkResult(createMockOpenDialogReturnValue()),
			),
		),
	},
	systemStatsEvent: { subscribe: vi.fn(() => () => undefined) },
};
