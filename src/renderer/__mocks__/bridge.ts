// eslint-disable-next-line import/no-named-as-default
import Long from "long";
import { vi } from "vitest";

import { createMockSystemInfo } from "~/common/__test__/mock-data-creators/system-info";

import type { AppBridge } from "../bridge";

const bridge: AppBridge = {
	getSystemInfo: vi.fn(() => Promise.resolve(createMockSystemInfo())),
	getNtkDaemonVersion: vi.fn(() =>
		Promise.resolve({
			major: new Long(0),
			minor: new Long(0),
			micro: new Long(0),
			build: "",
		}),
	),
	subscribeHealth: vi.fn(() => () => undefined),
	subscribeSystemInfo: vi.fn(() => () => undefined),
	subscribeNtkDaemonStatus: vi.fn(() => () => undefined),
};

export default bridge;
