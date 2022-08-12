import { render, waitFor, screen } from "@testing-library/react";

import { setupRenderWrapper } from "~/renderer/__test__/render-wrapper";

import SystemInfoList from "./system-info-list";

jest.mock("~/renderer/bridge");

describe("<SystemInfoList />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render system info", async () => {
    const { Wrapper } = setupRenderWrapper();

    render(
      <Wrapper>
        <SystemInfoList />
      </Wrapper>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/^os/)).toBeInTheDocument();
    });

    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });
});
