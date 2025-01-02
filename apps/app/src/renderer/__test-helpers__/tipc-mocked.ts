import {
	applyTipcMocks,
	emitTipcMainEvent,
	mockTipcRenderer,
} from "electron-typed-ipc/test/renderer";
import { vi } from "vitest";

import { createMockOpenDialogReturnValue } from "#common/__test-helpers__/mock-data-creators/electron";
import {
	createMockSystemInfo,
	createMockSystemStats,
} from "#common/__test-helpers__/mock-data-creators/system";
import CustomError from "#common/errors/custom-error";

import type { AppTIPC } from "#common/tipc/definition";

export const { namespace: tipcNamespace, api: tipcApi } =
	mockTipcRenderer<AppTIPC>({
		getThemeSource: vi.fn(() => Promise.resolve("dark" as const)),
		setThemeSource: vi.fn((source) => Promise.resolve(source)),
		getSystemInfo: vi.fn(() => Promise.resolve(createMockSystemInfo())),
		getSystemStats: vi.fn(() => Promise.resolve(createMockSystemStats())),
		throwCustomError: vi.fn(() => {
			return Promise.reject(new CustomError("CODE_A", "something happened"));
		}),
		showOpenDialog: vi.fn(() => {
			return Promise.resolve(createMockOpenDialogReturnValue());
		}),
	});

export const applyMocks = applyTipcMocks<AppTIPC>;

export const emitMainEvent = emitTipcMainEvent<AppTIPC>;
