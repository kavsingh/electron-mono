import { ipcMain, ipcRenderer } from "electron";
import type { IpcMainInvokeEvent } from "electron";
import type { Device } from "node-hid";

// Note: return types will be wrapped in a promise
export interface Requests {
  "request-hid-devices": () => Device[];
  "echo": (msg: string) => string;
}

export type RequestChannel = keyof Requests;

export const rendererRequest = <K extends RequestChannel>(channel: K) => (
  ...args: Parameters<Requests[K]>
): Promise<Immutable<ReturnType<Requests[K]>>> =>
  ipcRenderer.invoke(channel, ...args);

export const mainHandleRequest = <K extends RequestChannel>(
  channel: K,
  handler: (
    event: IpcMainInvokeEvent,
    args: Immutable<Parameters<Requests[K]>[0]>
  ) => Promise<ReturnType<Requests[K]>>
): void => ipcMain.handle(channel, handler);
