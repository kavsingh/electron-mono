import { getDaemonClient } from "./client";

const client = getDaemonClient();

export const getNtkDaemonVersion = client.createRequest(
	"daemonVersionRequest",
	"daemonVersionResponse",
	{ requestOptions: { receiveTimeout: 1000 } },
);
