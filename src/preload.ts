import { contextBridge } from "electron";

import { rendererRequester } from "./bridge/request";
import { rendererSubscribe } from "./bridge/pubsub";

const bridge = {
  getHidDevices: rendererRequester("hid-devices"),
  getEcho: rendererRequester("echo"),
  subscribeHealth: rendererSubscribe("health"),
};

contextBridge.exposeInMainWorld("bridge", bridge);

declare global {
  interface Window {
    bridge: Immutable<typeof bridge>;
  }
}
