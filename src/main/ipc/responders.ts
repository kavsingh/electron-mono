import usbDetection from "usb-detection";

import { mainResponder } from "~/bridge/request";

export const setupResponders = () => {
  const removeUsbResponder = mainResponder("usbDevices", () =>
    usbDetection.find()
  );

  return () => {
    removeUsbResponder();
  };
};
