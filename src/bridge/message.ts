import { ipcRenderer } from "electron";
import type { IpcRendererEvent, BrowserWindow } from "electron";

import type { Messages, MessageChannelName } from "./types";

type MessageHandler<K extends MessageChannelName> = (
  message: Immutable<Messages[K]>
) => void;

type RendererEventHandler<K extends MessageChannelName> = (
  event: IpcRendererEvent,
  message: Immutable<Messages[K]>
) => void;

export const rendererSubscription =
  <K extends MessageChannelName>(channel: K) =>
  (handler: MessageHandler<K>): (() => void) => {
    const ipcHandler: RendererEventHandler<K> = (_, message) =>
      handler(message);

    ipcRenderer.on(channel, ipcHandler);

    return () => ipcRenderer.removeListener(channel, ipcHandler);
  };

export const mainSendMessage = <K extends MessageChannelName>(
  win: BrowserWindow,
  channel: K,
  payload: Messages[K]
): void => win.webContents.send(channel, payload);
