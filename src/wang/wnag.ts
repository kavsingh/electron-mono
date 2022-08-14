/* eslint-disable */
// @ts-nocheck
import { ipcMain, ipcRenderer } from "electron";
import { isErrorLike, serializeError, deserializeError } from "serialize-error";

import type { ErrorObject } from "serialize-error";
import type { Messages, Requests } from "~/common/bridge/types";

const safeBridge = createSafeBridge<Requests, Messages>({
	serializers: (createSerializer) => [
		createSerializer<Error, ErrorObject>({
			match: (value) => value instanceof Error,
			matchSerialized: (value) => isErrorLike(value),
			serialize: (value) => serializeError(value),
			deserialize: (value) => deserializeError(value),
            throws: "root",
		}),
	],
});

const {
	createIpcMainSafeBridge,
	createIpcRendererSafeBridge,
	normalizeSafeBridgeResponses,
} = safeBridge;

// main ip setup
const { respond, publish } = createIpcMainSafeBridge(ipcMain);

publish(window, "channelName", payload)

const removeResponder = respond("requestName", (_, payload) =>
	doSomethingWithPayload(payload),
);

// preload
const { request, subscribe } = createIpcRendererSafeBridge(ipcRenderer);

const bridge = {
    request: request("requestName"),
    subscribe: subscribe("channelName"),
};

declare global {
    interface Window {
        bridge: typeof bridge
    }
}

// in renderer bridge expose
const normalizedBridge = normalizeSafeBridgeResponses(window.bridge);

export type Bridge = typeof normalizedBridge;

export const bridge: Bridge = normalizedBridge;




