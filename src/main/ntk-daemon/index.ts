import { DaemonSubscriberChannel } from "@nativeinstruments/ntk-daemon-node-lib";

import { getDaemonClient } from "./client";

const client = getDaemonClient();

export const getNtkDaemonVersion = client.createRequest(
	"daemonVersionRequest",
	"daemonVersionResponse",
	{ requestOptions: { receiveTimeout: 1000 } },
);

export const getNtkDaemonKnownProducts = client.createRequest(
	"knownProductsRequest",
	"knownProductsResponse",
);

export const subscribeNtkDaemonStatus = client.subscribe.bind(
	client,
	DaemonSubscriberChannel.Status,
);
