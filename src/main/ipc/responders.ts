import usbDetection from "usb-detection";

import { mainResponder } from "~/bridge/request";

export const setupResponders = () => {
  const removeEchoResponder = mainResponder("echo", (_, ping) =>
    Promise.resolve(`${ping}... ${ping}... ${ping}`)
  );
  const removeUsbResponder = mainResponder("usbDevices", () =>
    usbDetection.find()
  );

  return () => {
    removeEchoResponder();
    removeUsbResponder();
  };
};
