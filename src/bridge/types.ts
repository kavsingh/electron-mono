import type { Device } from "usb-detection";

// Note: return types will be wrapped in a promise
export interface Requests {
  usbDevices: () => Device[];
}

export type RequestChannelName = keyof Requests;

export interface Messages {
  health: { status: "ok" };
  usbDevice: { device: Device; status: "added" | "removed" };
}

export type MessageChannelName = keyof Messages;
