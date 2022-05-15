import usbDetection from "usb-detection";

import { mainPublish } from "~/bridge/pubsub";

import type { BrowserWindow } from "electron";

export const attachUsbDetection = (win: BrowserWindow) => {
  usbDetection.on("add", (device) => {
    mainPublish(win, "usbDevice", { device, status: "added" });
  });

  usbDetection.on("remove", (device) => {
    mainPublish(win, "usbDevice", { device, status: "removed" });
  });

  return () => undefined;
};
