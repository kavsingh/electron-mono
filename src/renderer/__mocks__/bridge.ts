import { vi } from "vitest";

import { createMockSystemInfo } from "~/common/__test__/mock-data-creators/system-info";

import type { AppBridge } from "../bridge";

const bridge: AppBridge = {
	getSystemInfo: vi.fn(() => Promise.resolve(createMockSystemInfo())),
	getNtkDaemonVersion: vi.fn(() =>
		Promise.resolve({
			result: "success",
			message: {
				major: BigInt(0),
				minor: BigInt(0),
				micro: BigInt(0),
				build: "",
			},
		}),
	),
	subscribeSystemInfo: vi.fn(() => () => undefined),
	subscribeNtkDaemonStatus: vi.fn(() => () => undefined),
};

export default bridge;
