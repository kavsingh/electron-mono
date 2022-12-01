import { vi } from "vitest";

import { createMockSystemInfo } from "~/common/__test__/mock-data-creators/system-info";

import type { AppBridge } from "../bridge";

const bridge: AppBridge = {
	getSystemInfo: vi.fn(() => Promise.resolve(createMockSystemInfo())),
	subscribeHealth: vi.fn(() => () => undefined),
	subscribeSystemInfo: vi.fn(() => () => undefined),
};

export default bridge;
