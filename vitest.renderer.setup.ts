import "@testing-library/jest-dom/vitest";
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { cleanup } from "solid-testing-library";
import { vi, afterEach } from "vitest";

vi.mock("./src/renderer/trpc/client");

afterEach(() => {
	cleanup();
});
