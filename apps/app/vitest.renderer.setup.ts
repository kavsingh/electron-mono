import "@testing-library/jest-dom/vitest";
import "vitest-canvas-mock";

import { cleanup } from "@solidjs/testing-library";
import { vi, afterEach } from "vitest";

vi.mock("./src/renderer/trpc");

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
