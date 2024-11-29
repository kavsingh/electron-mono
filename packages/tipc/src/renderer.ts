import { TIPC_GLOBAL_NAMESPACE } from "./common";

import type { Serializer, TIPCDefinitions } from "./common";
import type { IpcRendererEvent } from "electron";

export function createTIPCRenderer<TDefinitions extends TIPCDefinitions>(
	serializer: Serializer,
) {
	type Invoke = TDefinitions["invoke"];
	type MainEvents = TDefinitions["mainEvents"];
	type RendererEvents = TDefinitions["rendererEvents"];

	const api = globalThis.window[TIPC_GLOBAL_NAMESPACE];

	async function invoke<TChannel extends string & keyof Invoke>(
		channel: TChannel,
		...[arg]: keyof Invoke[TChannel][0] extends never
			? []
			: [Invoke[TChannel][0]]
	): Promise<Invoke[TChannel][1]> {
		const result = await api.invoke(
			channel,
			arg ? serializer.serialize(arg) : undefined,
		);

		return serializer.deserialize(result);
	}

	function send<TChannel extends string & keyof RendererEvents>(
		channel: TChannel,
		payload: RendererEvents[TChannel],
	) {
		api.send(channel, serializer.serialize(payload));
	}

	function subscribe<TChannel extends string & keyof MainEvents>(
		channel: TChannel,
		handler: (
			event: IpcRendererEvent,
			payload: MainEvents[TChannel],
		) => void | PromiseLike<void>,
	) {
		return api.subscribe(channel, (event, payload) => {
			void handler(
				event,
				serializer.deserialize(payload) as MainEvents[TChannel],
			);
		});
	}

	return { invoke, send, subscribe } as const;
}
