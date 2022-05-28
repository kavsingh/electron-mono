import { contextBridge } from "electron";

import { rendererSubscriber } from "./bridge/pubsub";
import { rendererRequester } from "./bridge/request";

const bridge = {
  getUsbDevices: rendererRequester("usbDevices"),
  subscribeHealth: rendererSubscriber("health"),
  subscribeUsbDevices: rendererSubscriber("usbDevice"),
};

contextBridge.exposeInMainWorld("bridge", bridge);

declare global {
  interface Window {
    bridge: Immutable<typeof bridge>;
  }
}
