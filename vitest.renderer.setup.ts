import matchers from "@testing-library/jest-dom/matchers";
import { expect, vi } from "vitest";

expect.extend(matchers);
vi.mock("./src/renderer/trpc/client");
