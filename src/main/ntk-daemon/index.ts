import { DaemonSubscriberChannel } from "@nativeinstruments/ntk-daemon-node-lib";

import { measuredAsyncFn } from "~/common/measure";

import { getDaemonClient } from "./client";

const client = getDaemonClient();

export const getNtkDaemonVersion = measuredAsyncFn(
	"getNtkDaemonVersion",
	client.createRequest("daemonVersionRequest", "daemonVersionResponse", {
		requestOptions: { receiveTimeout: 1000 },
	}),
);

export const getNtkDaemonKnownProducts = measuredAsyncFn(
	"getNtkDaemonKnownProducts",
	client.createRequest("knownProductsRequest", "knownProductsResponse"),
);

export const subscribeNtkDaemonStatus = client.subscribe.bind(
	client,
	DaemonSubscriberChannel.Status,
);
