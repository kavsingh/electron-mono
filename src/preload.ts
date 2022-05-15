import { contextBridge } from "electron";

import { rendererRequester } from "./bridge/request";
import { rendererSubscriber } from "./bridge/pubsub";

const bridge = {
  getUsbDevices: rendererRequester("usbDevices"),
  getEcho: rendererRequester("echo"),
  subscribeHealth: rendererSubscriber("health"),
  subscribeUsbDevices: rendererSubscriber("usbDevice"),
};

contextBridge.exposeInMainWorld("bridge", bridge);

declare global {
  interface Window {
    bridge: Immutable<typeof bridge>;
  }
}
