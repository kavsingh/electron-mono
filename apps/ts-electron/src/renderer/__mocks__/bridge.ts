import { vi } from "vitest";

import type { AppBridge } from "../bridge";

const bridge: AppBridge = {
	gqlIpc: {
		send: vi.fn(),
		on: vi.fn(),
		removeListener: vi.fn(),
	},
};

export default bridge;
