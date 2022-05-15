import { ipcRenderer } from "electron";

import type { IpcRendererEvent, BrowserWindow } from "electron";
import type { Messages, MessageChannelName } from "./types";

export const mainPublish = <K extends MessageChannelName>(
  win: BrowserWindow,
  channel: K,
  payload: Messages[K]
): void => {
  if (win.isDestroyed()) return;

  win.webContents.send(channel, payload);
};

export const rendererSubscriber =
  <K extends MessageChannelName>(channel: K) =>
  (handler: RendererMessageHandler<K>): (() => void) => {
    const ipcHandler: RendererEventHandler<K> = (_, message) =>
      handler(message);

    ipcRenderer.on(channel, ipcHandler);

    return () => ipcRenderer.removeListener(channel, ipcHandler);
  };

type RendererMessageHandler<K extends MessageChannelName> = (
  message: Immutable<Messages[K]>
) => void;

type RendererEventHandler<K extends MessageChannelName> = (
  event: IpcRendererEvent,
  message: Immutable<Messages[K]>
) => void;
