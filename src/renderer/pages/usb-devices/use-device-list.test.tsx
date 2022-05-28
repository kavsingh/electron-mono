import { render, waitFor, screen } from "@testing-library/react";

import { createMockUsbDevice } from "~/common/__test__/mock-data-creators/usb-devices";
import { setupRenderWrapper } from "~/renderer/__test__/render-wrapper";
import bridge from "~/renderer/bridge";

import UsbDeviceList from "./usb-device-list";

jest.mock("~/renderer/bridge");

describe("<UsbDeviceList />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render usb devices", async () => {
    jest
      .spyOn(bridge, "getUsbDevices")
      .mockResolvedValueOnce([createMockUsbDevice()]);

    const { Wrapper } = setupRenderWrapper();

    render(
      <Wrapper>
        <UsbDeviceList />
      </Wrapper>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/^Device name/)).toBeInTheDocument();
    });

    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });
});