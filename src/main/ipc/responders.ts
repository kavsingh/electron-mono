import usbDetection from "usb-detection";

import { mainResponder } from "~/bridge/request";

export const setupResponders = () => {
  const removeGetUsbDevicesResponder = mainResponder(
    "getUsbDevices",
    (_, params) =>
      params?.vendorId
        ? usbDetection.find(params.vendorId)
        : usbDetection.find()
  );

  return () => {
    removeGetUsbDevicesResponder();
  };
};
