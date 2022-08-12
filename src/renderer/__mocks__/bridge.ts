import { createMockSystemInfo } from "~/common/__test__/mock-data-creators/system-info";

import type { AppBridge } from "../bridge";

const bridge: AppBridge = {
  getSystemInfo: jest.fn(() => Promise.resolve(createMockSystemInfo())),
  subscribeHealth: jest.fn(() => () => undefined),
  subscribeSystemInfo: jest.fn(() => () => undefined),
};

export default bridge;
