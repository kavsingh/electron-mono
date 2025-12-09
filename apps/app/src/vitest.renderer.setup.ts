// oxlint-disable import/no-unassigned-import

import "vitest-canvas-mock";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { vi, afterEach } from "vitest";

// @ts-expect-error TODO: mock this out somehow
globalThis.electronTRPC = {
	sendMessage: () => undefined,
	onMessage: () => undefined,
};

vi.stubGlobal(
	"ResizeObserver",
	class {
		observe = vi.fn();
		unobserve = vi.fn();
		disconnect = vi.fn();
	},
);

vi.stubGlobal(
	"matchMedia",
	vi.fn(() => ({ addEventListener: vi.fn(), removeEventListener: vi.fn() })),
);

afterEach(() => {
	cleanup();
});
