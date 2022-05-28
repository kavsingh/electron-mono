import usbDetection from "usb-detection";

import { mainResponder } from "~/bridge/request";

export const setupResponders = () => {
  const removeGetUsbDevicesResponder = mainResponder("getUsbDevices", () =>
    usbDetection.find()
  );

  return () => {
    removeGetUsbDevicesResponder();
  };
};
