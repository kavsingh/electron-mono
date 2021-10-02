import { contextBridge } from "electron";

import { rendererRequest } from "./bridge/request";
import { rendererSubscription } from "./bridge/message";

const bridge = {
  getHidDevices: rendererRequest("hid-devices"),
  getEcho: rendererRequest("echo"),
  subscribeHealth: rendererSubscription("health"),
};

contextBridge.exposeInMainWorld("bridge", bridge);

declare global {
  interface Window {
    bridge: Immutable<typeof bridge>;
  }
}
