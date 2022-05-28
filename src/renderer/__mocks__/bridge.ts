import type { AppBridge } from "../bridge";

const bridge: AppBridge = {
  getUsbDevices: jest.fn(() => Promise.resolve([])),
  subscribeHealth: jest.fn(() => () => undefined),
  subscribeUsbDevices: jest.fn(() => () => undefined),
};

export default bridge;
