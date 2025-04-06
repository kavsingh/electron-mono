import { BrowserWindow, ipcMain } from "electron";

import { scopeChannel } from "./internal.ts";
import { defaultSerializer } from "./serializer.ts";

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
} from "./internal.ts";
import type { Logger } from "./logger.ts";
import type { Serializer } from "./serializer.ts";
import type { IpcMainEvent, IpcMainInvokeEvent, WebContents } from "electron";

export function createElectronTypedIpcMain<TSchema extends Schema<Definition>>(
	schema: TSchema,
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

		logger?.debug("add handler", operation, channel);

		ipcMain.handle(
			scopedChannel,
			async (event, input: unknown): Promise<IpcResult> => {
				logger?.debug("handle", operation, channel, input);

				try {
					const result: IpcResult = {
						__r: "ok",
						data: await handler(event, serializer.deserialize(input)),
					};

					logger?.debug("handle result", operation, channel, result);

					return result;
				} catch (reason) {
					const error =
						reason instanceof Error ? reason : new Error(String(reason));
					const result: IpcResult = {
						__r: "error",
						error: serializer.serialize(error),
					};

					logger?.debug("handle result", operation, channel, result);

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
		return function sendPayload(input) {
			logger?.debug("send", channel, input?.payload);

			const scopedChannel = scopeChannel(`${channel}/sendFromMain`);
			const targets = input?.targetWindows ?? BrowserWindow.getAllWindows();

			for (const target of targets) {
				if (target.isDestroyed()) continue;

				const serialized = serializer.serialize(input?.payload);

				if (input?.frames) {
					logger?.debug("send to frame", channel, input.frames, input.payload);
					target.webContents.sendToFrame(
						input.frames,
						scopedChannel,
						serialized,
					);
				} else {
					logger?.debug("send to window", channel, input?.payload);
					target.webContents.send(scopedChannel, serialized);
				}
			}
		};
	}

	function addSender(
		channel: string,
		senderFn: (senderApi: { send: SendPayloadToChannel }) => DisposeFn,
	) {
		logger?.debug("add sender", channel);

		const dispose = senderFn({ send: sendToChannel(channel) });

		return function disposeSender() {
			logger?.debug("remove sender", channel);

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

	const proxyObj = {};
	const proxyFn = () => undefined;

	function subscribeProxy(channel: string) {
		return new Proxy(proxyFn, {
			apply: (_, __, [handler]: [(...args: unknown[]) => unknown]) => {
				logger?.debug("add subscription", channel);

				const scopedChannel = scopeChannel(`${channel}/sendFromRenderer`);

				function eventHandler(event: unknown, payload: unknown) {
					logger?.debug("subscribe handler", { scopedChannel, payload });
					void handler(event, serializer.deserialize(payload));
				}

				logger?.debug("subscribe", { scopedChannel, handler });
				ipcMain.addListener(scopedChannel, eventHandler);

				return function unsubscribe() {
					logger?.debug("unsubscribe", { scopedChannel, handler });
					ipcMain.removeListener(scopedChannel, eventHandler);
				};
			},
		});
	}

	function operationsProxy(channel: string) {
		return new Proxy(proxyObj, {
			get: (_, operation) => {
				if (operation === "subscribe") return subscribeProxy(channel);

				logger?.warn(
					`invalid operation, expected 'subscribe', got ${String(operation)}`,
				);

				return undefined;
			},
		});
	}

	const ipcSubscriptions = new Proxy(proxyObj, {
		get: (_, channel) => {
			if (typeof channel !== "string") return undefined;

			return operationsProxy(channel);
		},
	}) as Readonly<{
		[TChannel in keyof SubscribeOps<TSchema>]: Subscribable<TSchema, TChannel>;
	}>;

	return { ipcHandleAndSend, ipcSubscriptions };
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
				event: IpcMainInvokeEvent,
				...args: TSchema[TChannel]["input"] extends undefined
					? []
					: [input: TSchema[TChannel]["input"]]
			) =>
				| Voidable<TSchema[TChannel]["response"]>
				| Promise<Voidable<TSchema[TChannel]["response"]>>
		: TSchema[TChannel] extends OperationWithChannel<Mutation>
			? (
					event: IpcMainInvokeEvent,
					...args: TSchema[TChannel]["input"] extends undefined
						? []
						: [input: TSchema[TChannel]["input"]]
				) =>
					| Voidable<TSchema[TChannel]["response"]>
					| Voidable<Promise<TSchema[TChannel]["response"]>>
			: TSchema[TChannel] extends OperationWithChannel<SendFromMain>
				? (senderApi: {
						send: (
							...args: TSchema[TChannel]["payload"] extends undefined
								? [input?: SendFromMainOptions | undefined]
								: [
										input: {
											payload: TSchema[TChannel]["payload"];
										} & SendFromMainOptions,
									]
						) => void;
					}) => DisposeFn
				: never;

type Subscribable<
	TSchema extends SubscribeOps<Schema<Definition>>,
	TChannel extends keyof TSchema,
> =
	TSchema[TChannel] extends OperationWithChannel<SendFromRenderer>
		? {
				subscribe: (
					listener: (
						...args: TSchema[TChannel]["payload"] extends undefined
							? [event: IpcMainEvent]
							: [event: IpcMainEvent, payload: TSchema[TChannel]["payload"]]
					) => void | Promise<void>,
				) => DisposeFn;
			}
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

type SendPayloadToChannel = (
	input?: { payload?: unknown } & SendFromMainOptions,
) => void;

type KeysForOp<
	TSchema extends Schema<Definition>,
	TOp extends OperationWithChannel<Operation>,
> = {
	[K in keyof TSchema]: TSchema[K] extends TOp ? K : never;
}[keyof TSchema];
