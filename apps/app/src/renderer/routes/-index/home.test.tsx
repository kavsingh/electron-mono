import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, waitFor, screen } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";

import { createMockSystemStats } from "#common/__test-helpers__/mock-data-creators/system";
import { publishSystemStatsEvent } from "#renderer/__test-helpers__/trpc/events";
import { Index } from "#renderer/routes/index";

import type { PropsWithChildren } from "react";

function setup() {
	const client = new QueryClient();

	function Wrapper(props: PropsWithChildren) {
		return (
			<QueryClientProvider client={client}>
				{props.children}
			</QueryClientProvider>
		);
	}

	return { Wrapper, client };
}

describe("<Index />", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("should load and render home page", async () => {
		expect.assertions(4);

		render(<Index />, { wrapper: setup().Wrapper });

		expect(
			screen.getByRole("heading", { name: "Home", level: 2 }),
		).toBeInTheDocument();
		expect(screen.queryByText("1.00 GB")).not.toBeInTheDocument();

		await waitFor(() => {
			expect(screen.getByText("1.00 GB")).toBeInTheDocument();
		});

		expect(screen.queryByText("loading...")).not.toBeInTheDocument();
	});

	it("should update system stats from events", async () => {
		expect.assertions(4);

		render(<Index />, { wrapper: setup().Wrapper });

		await waitFor(() => {
			expect(screen.getByText("600.00 MB")).toBeInTheDocument();
		});

		expect(screen.queryByText("500.00 MB")).not.toBeInTheDocument();

		publishSystemStatsEvent(
			createMockSystemStats({
				memUsed: String(1024 * 1024 * 500),
				sampledAt: "1",
			}),
		);

		await waitFor(() => {
			expect(screen.getByText("500.00 MB")).toBeInTheDocument();
		});

		expect(screen.queryByText("600.00 MB")).not.toBeInTheDocument();
	});
});
