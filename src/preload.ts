import { contextBridge } from "electron";

import { rendererRequester } from "./bridge/request";
import { rendererSubscriber } from "./bridge/pubsub";

const bridge = {
  getHidDevices: rendererRequester("hid-devices"),
  getEcho: rendererRequester("echo"),
  subscribeHealth: rendererSubscriber("health"),
};

contextBridge.exposeInMainWorld("bridge", bridge);

declare global {
  interface Window {
    bridge: Immutable<typeof bridge>;
  }
}
