import { contextBridge } from "electron";

import { rendererRequest } from "@/bridge/request";
import { rendererSubscription } from "@/bridge/message";

const bridge = {
  getHidDevices: rendererRequest("request-hid-devices"),
  getEcho: rendererRequest("echo"),
  subscribeHealth: rendererSubscription("health"),
} as const;

contextBridge.exposeInMainWorld("bridge", bridge);

declare global {
  interface Window {
    bridge: typeof bridge;
  }
}
