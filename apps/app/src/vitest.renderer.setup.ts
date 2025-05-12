import "@testing-library/jest-dom/vitest";
import "vitest-canvas-mock";

import { cleanup } from "@testing-library/react";
import { vi, afterEach } from "vitest";

// @ts-expect-error TODO: mock this out somehow
globalThis.electronTRPC = {
	sendMessage: () => undefined,
	onMessage: () => undefined,
};

vi.stubGlobal(
	"ResizeObserver",
	vi.fn(() => ({ observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() })),
);

vi.stubGlobal(
	"matchMedia",
	vi.fn(() => ({ addEventListener: vi.fn(), removeEventListener: vi.fn() })),
);

afterEach(() => {
	cleanup();
});
