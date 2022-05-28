import type { Device } from "usb-detection";

// Note: return types will be wrapped in a promise
export interface Requests {
  getUsbDevices: () => Device[];
}

export type RequestChannelName = keyof Requests;

export interface Messages {
  health: HealthMessage;
  usbDevice: { device: Device; status: "added" | "removed" };
}

export type MessageChannelName = keyof Messages;

type HealthMessage =
  | { status: "ok"; timestamp: bigint }
  | { status: "error"; timestamp: bigint; error: Error };
