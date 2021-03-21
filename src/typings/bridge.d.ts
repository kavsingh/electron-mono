import "electron";

import type { Messages, Requests } from "~/bridge/types";

declare module "NOTWORKING_electron" {
  namespace Electron {
    interface IpcMain {
      handle: <K extends keyof Requests, T = Requests[K]>(
        channel: K,
        handler: (
          event: Electron.IpcMainInvokeEvent,
          args: Parameters<T>[0]
        ) => Promise<ReturnType<T>>
      ) => void;
    }

    interface IpcRenderer {
      invoke: <K extends keyof Requests, T = Requests[K]>(
        channel: K,
        args: Parameters<T>[0]
      ) => Promise<ReturnType<T>>;

      on: <K extends keyof Messages>(
        channel: K,
        handler: (
          event: Electron.IpcRendererEvent,
          message: Messages[K]
        ) => void
      ) => IpcRenderer;

      once: <K extends keyof Messages>(
        channel: K,
        handler: (
          event: Electron.IpcRendererEvent,
          message: Messages[K]
        ) => void
      ) => IpcRenderer;

      removeListener: <K extends keyof Messages>(
        channel: K,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: (...args: any[]) => void
      ) => IpcRenderer;

      removeAllListeners: <K extends keyof Messages>(channel: K) => IpcRenderer;
    }
  }
}
