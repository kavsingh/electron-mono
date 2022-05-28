import { ipcMain, ipcRenderer } from "electron";

import {
  serializeBridgePayload,
  deserializeBridgePayload,
} from "~/common/bridge/serialization";

import type { Requests, RequestChannelName } from "./types";
import type { IpcMainInvokeEvent } from "electron";
import type {
  SerializedBridgePayload,
  DeserializedBridgePayload,
} from "~/common/bridge/serialization";

export const rendererRequester =
  <K extends RequestChannelName>(channel: K) =>
  async (
    args: keyof Parameters<Requests[K]> extends never
      ? void
      : Parameters<Requests[K]>[0]
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response: SerializedBridgePayload<ReturnType<Requests[K]>> =
      await ipcRenderer.invoke(channel, serializeBridgePayload(args ?? {}));

    return deserializeBridgePayload(response);
  };

export const mainResponder = <K extends RequestChannelName>(
  channel: K,
  handler: (
    event: IpcMainInvokeEvent,
    args: DeserializedBridgePayload<
      keyof Parameters<Requests[K]> extends never
        ? void
        : Parameters<Requests[K]>[0]
    >
  ) => Promise<ReturnType<Requests[K]>>
): (() => void) => {
  ipcMain.handle(
    channel,
    (
      event: IpcMainInvokeEvent,
      args: SerializedBridgePayload<
        keyof Parameters<Requests[K]> extends never
          ? void
          : Parameters<Requests[K]>[0]
      >
    ) =>
      handler(event, deserializeBridgePayload(args))
        .then(serializeBridgePayload)
        .catch((reason) => {
          throw serializeBridgePayload(reason);
        })
  );

  return () => ipcMain.removeHandler(channel);
};
