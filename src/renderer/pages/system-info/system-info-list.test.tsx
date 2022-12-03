import { render, waitFor, screen } from "@testing-library/react";
import { describe, beforeEach, it, expect, vi } from "vitest";

import { setupRenderWrapper } from "~/renderer/__test-helpers__/render-wrapper";

import SystemInfoList from "./system-info-list";

vi.mock("~/renderer/bridge");

describe("<SystemInfoList />", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should render system info", async () => {
		const { Wrapper } = setupRenderWrapper();

		render(
			<Wrapper>
				<SystemInfoList />
			</Wrapper>,
		);

		expect(screen.getByText("Loading...")).toBeInTheDocument();

		await waitFor(() => {
			expect(screen.getByText(/^os/)).toBeInTheDocument();
		});

		expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
	});
});
