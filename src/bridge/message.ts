import { ipcRenderer } from "electron";
import type { BrowserWindow, IpcRendererEvent } from "electron";

export interface Messages {
  health: { status: "ok" };
  networkStatus: { status: "idle" | "busy" | "offline" };
}

export type MessageChannel = keyof Messages;

type MessageHandler<K extends MessageChannel> = (message: Messages[K]) => void;

type EventHandler<K extends MessageChannel> = (
  event: IpcRendererEvent,
  message: Messages[K]
) => void;

export const rendererSubscription = <K extends MessageChannel>(channel: K) => (
  handler: MessageHandler<K>
): (() => void) => {
  const ipcHandler: EventHandler<K> = (_, message) => handler(message);

  ipcRenderer.on(channel, ipcHandler);

  return () => ipcRenderer.removeListener(channel, ipcHandler);
};

export const mainSendMessage = <K extends MessageChannel>(
  win: BrowserWindow,
  channel: K,
  payload: Messages[K]
): void => win.webContents.send(channel, payload);
