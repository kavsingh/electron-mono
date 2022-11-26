import DaemonClient from "@nativeinstruments/ntk-daemon-node-lib/dist/DaemonClient";

export const getDaemonClient = () => {
	client ??= new DaemonClient({
		requestSocket: "tcp://127.0.0.1:5146",
		subscriberSocket: "tcp://127.0.0.1:5563",
	});

	return client;
};

let client: DaemonClient;
