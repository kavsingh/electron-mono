import { BrowserWindow } from "electron";

import { scopeChannel } from "./internal";
import { defaultSerializer } from "./serializer";

import type {
	Definition,
	IpcResult,
	Mutation,
	Operation,
	OperationWithChannel,
	Query,
	Schema,
	SendFromMain,
	SendFromRenderer,
} from "./internal";
import type { Logger } from "./logger";
import type { Serializer } from "./serializer";
import type { IpcMain, WebContents } from "electron";

export function createElectronTypedIpcMain<TSchema extends Schema<Definition>>(
	schema: TSchema,
	ipcMain: IpcMain,
	options: CreateTypedIpcMainOptions = {},
) {
	const serializer = options.serializer ?? defaultSerializer;
	const logger = options.logger;
	const disposers: DisposeFn[] = [];

	function addHandler(
		operation: "query" | "mutation",
		channel: string,
		handler: (...args: unknown[]) => unknown,
	) {
		const scopedChannel = scopeChannel(`${channel}/${operation}`);

		logger?.debug("add handler", { operation, channel });

		ipcMain.handle(
			scopedChannel,
			async (event, input: unknown): Promise<IpcResult> => {
				logger?.debug("handle", { operation, channel, input });

				try {
					const result: IpcResult = {
						__r: "ok",
						data: await handler(event, serializer.deserialize(input)),
					};

					logger?.debug("handle result", { operation, channel, result });

					return result;
				} catch (reason) {
					const error =
						reason instanceof Error ? reason : new Error(String(reason));
					const result: IpcResult = {
						__r: "error",
						error: serializer.serialize(error),
					};

					logger?.debug("handle result", { operation, channel, result });

					return result;
				}
			},
		);

		disposers.push(() => {
			try {
				ipcMain.removeHandler(scopedChannel);
			} catch (reason) {
				logger?.warn(`failed to remove handler for ${channel}`, reason);
			}
		});
	}

	function sendToChannel(channel: string): SendPayloadToChannel {
		return function sendPayload({ options: opts, payload } = {}) {
			const targets = opts?.targetWindows ?? BrowserWindow.getAllWindows();

			for (const target of targets) {
				if (target.isDestroyed()) continue;

				const serialized = serializer.serialize(payload);

				if (opts?.frames) {
					target.webContents.sendToFrame(opts.frames, channel, serialized);
				} else {
					target.webContents.send(channel, serialized);
				}
			}
		};
	}

	function addSender(
		channel: string,
		senderFn: (send: SendPayloadToChannel) => DisposeFn,
	) {
		const dispose = senderFn(sendToChannel(channel));

		return function disposeSender() {
			try {
				dispose();
			} catch (reason) {
				logger?.warn(`failed to remove sender for ${channel}`, reason);
			}
		};
	}

	function ipcHandleAndSend(
		operationFns: Partial<
			Readonly<{
				[TChannel in keyof HandleOrSendOps<TSchema>]: HandleOrSendFn<
					HandleOrSendOps<TSchema>,
					TChannel
				>;
			}>
		>,
	): DisposeFn {
		for (const [channel, op] of Object.entries(schema)) {
			const fn = operationFns[channel as keyof typeof operationFns];

			if (typeof fn !== "function") {
				logger?.warn(
					`could not setup ${channel} for ${op.operation}. expected a function, got ${typeof fn}`,
				);

				continue;
			}

			switch (op.operation) {
				case "query":
				case "mutation": {
					addHandler(
						op.operation,
						channel,
						fn as Parameters<typeof addHandler>[2],
					);
					break;
				}

				case "sendFromMain":
					addSender(channel, fn as Parameters<typeof addSender>[1]);
					break;
			}
		}

		return function dispose() {
			for (const disposeFn of disposers) disposeFn();
		};
	}

	return { ipcHandleAndSend };
}

export type CreateTypedIpcMainOptions = {
	serializer?: Serializer | undefined;
	logger?: Logger | undefined;
};

export type SendFromMainOptions = {
	frames?: Parameters<WebContents["sendToFrame"]>[0] | undefined;
	targetWindows?: BrowserWindow[] | undefined;
};

type HandleOrSendFn<
	TSchema extends HandleOrSendOps<Schema<Definition>>,
	TChannel extends keyof TSchema,
> =
	TSchema[TChannel] extends OperationWithChannel<Query>
		? (
				event: Parameters<Parameters<IpcMain["handle"]>[1]>[0],
				...args: keyof TSchema[TChannel]["input"] extends never
					? []
					: [input: TSchema[TChannel]["input"]]
			) =>
				| Voidable<TSchema[TChannel]["response"]>
				| Promise<Voidable<TSchema[TChannel]["response"]>>
		: TSchema[TChannel] extends OperationWithChannel<Mutation>
			? (
					event: Parameters<Parameters<IpcMain["handle"]>[1]>[0],
					...args: keyof TSchema[TChannel]["input"] extends never
						? []
						: [input: TSchema[TChannel]["input"]]
				) =>
					| Voidable<TSchema[TChannel]["response"]>
					| Voidable<Promise<TSchema[TChannel]["response"]>>
			: TSchema[TChannel] extends OperationWithChannel<SendFromMain>
				? (
						send: (
							...args: keyof TSchema[TChannel]["payload"] extends never
								? [input?: { options?: SendFromMainOptions | undefined }]
								: [
										input: {
											payload: TSchema[TChannel]["payload"];
											options?: SendFromMainOptions | undefined;
										},
									]
						) => void,
					) => DisposeFn
				: never;

type DisposeFn = () => void;

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
type Voidable<TVal> = TVal extends undefined ? void : TVal;

type HandleOrSendOps<TSchema extends Schema<Definition>> = Pick<
	TSchema,
	KeysForOp<
		TSchema,
		| OperationWithChannel<Query>
		| OperationWithChannel<Mutation>
		| OperationWithChannel<SendFromMain>
	>
>;

type SubscribeOps<TSchema extends Schema<Definition>> = Pick<
	TSchema,
	KeysForOp<TSchema, OperationWithChannel<SendFromRenderer>>
>;

type SendPayloadToChannel = (input?: {
	payload?: unknown;
	options?: SendFromMainOptions | undefined;
}) => void;

type KeysForOp<
	TSchema extends Schema<Definition>,
	TOp extends OperationWithChannel<Operation>,
> = {
	[K in keyof TSchema]: TSchema[K] extends TOp ? K : never;
}[keyof TSchema];
