import type { Device } from "node-hid";

export interface Messages {
  health: { status: "ok" };
  networkStatus: { status: "idle" | "busy" | "offline" };
}

export type MessageChannelName = keyof Messages;

// Note: return types will be wrapped in a promise
export interface Requests {
  "hid-devices": () => Device[];
  "echo": (msg: string) => string;
}

export type RequestChannelName = keyof Requests;
