import matchers from "@testing-library/jest-dom/matchers";
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { cleanup } from "solid-testing-library";
import { vi, afterEach, expect } from "vitest";

import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

expect.extend(matchers);
vi.mock("./src/renderer/trpc/client");

afterEach(() => {
	cleanup();
});

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Vi {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-interface
		interface JestAssertion<T = any> extends ExtendedJestMatchers<T> {}
	}
}

type ExtendedJestMatchers<T> = jest.Matchers<void, T> &
	TestingLibraryMatchers<T, void>;
