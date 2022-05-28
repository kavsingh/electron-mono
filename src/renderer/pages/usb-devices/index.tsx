import UsbDeviceList from "./usb-device-list";

import type { FC } from "react";

const UsbDevices: FC = () => (
  <div>
    <h2>USB Devices</h2>
    <UsbDeviceList />
  </div>
);

export default UsbDevices;
