import { ipcMain, ipcRenderer } from "electron";

import type { Requests, RequestChannelName } from "./types";
import type { IpcMainInvokeEvent } from "electron";

export const rendererRequester =
  <K extends RequestChannelName>(channel: K) =>
  (
    ...args: Parameters<Requests[K]>
  ): Promise<Immutable<ReturnType<Requests[K]>>> =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    ipcRenderer.invoke(channel, ...args);

export const mainResponder = <K extends RequestChannelName>(
  channel: K,
  handler: (
    event: IpcMainInvokeEvent,
    args: Immutable<Parameters<Requests[K]>[0]>
  ) => Promise<ReturnType<Requests[K]>>
): (() => void) => {
  ipcMain.handle(channel, handler);

  return () => ipcMain.removeHandler(channel);
};
