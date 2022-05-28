import { render, waitFor, screen } from "@testing-library/react";

import { createMockUsbDevice } from "~/renderer/__test__/mock-data-creators/usb-devices";
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

    render(<UsbDeviceList />);

    await waitFor(() => {
      expect(screen.getByText(/^Device name/)).toBeInTheDocument();
    });
  });
});
