import { ipcMain, ipcRenderer } from "electron";

import type { IpcMainInvokeEvent } from "electron";
import type { Requests, RequestChannelName } from "./types";

export const rendererRequest =
  <K extends RequestChannelName>(channel: K) =>
  (
    ...args: Parameters<Requests[K]>
  ): Promise<Immutable<ReturnType<Requests[K]>>> =>
    // No ability to pass generic to invoke to override any, hence
    // the wrapper fn
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    ipcRenderer.invoke(channel, ...args);

export const mainHandleRequest = <K extends RequestChannelName>(
  channel: K,
  handler: (
    event: IpcMainInvokeEvent,
    args: Immutable<Parameters<Requests[K]>[0]>
  ) => Promise<ReturnType<Requests[K]>>
): (() => void) => {
  ipcMain.handle(channel, handler);

  return () => ipcMain.removeHandler(channel);
};
