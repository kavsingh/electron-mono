import type { Device } from "usb-detection";

export interface Messages {
  health: { status: "ok" };
  networkStatus: { status: "idle" | "busy" | "offline" };
  usbDevice: { device: Device; status: "added" | "removed" };
}

export type MessageChannelName = keyof Messages;

// Note: return types will be wrapped in a promise
export interface Requests {
  echo: (msg: string) => string;
  usbDevices: () => Device[];
}

export type RequestChannelName = keyof Requests;
