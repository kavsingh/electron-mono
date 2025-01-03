/* eslint-disable @typescript-eslint/no-unused-expressions */
import { describe, it, expectTypeOf, expect } from "vitest";

import { createElectronTipcMain } from "../src/main";
import { createElectronTipcRenderer } from "../src/renderer";

import { createMockIpcMain } from "./mocks";

import type { IpcRendererEvent } from "electron";

const { tipcMain, createRouter } = createElectronTipcMain(createMockIpcMain());

type MainSendPayload = { _type: "mainSend" };
type MainSendToFramePayload = { _type: "mainSendToFrame" };
type RendererSendPayload = { _type: "mainSendToFrame" };

const _appRouter = createRouter({
	queryWithoutArgVoidReturn: tipcMain.queryHandler((_) => undefined),
	queryWithoutArgSyncReturn: tipcMain.queryHandler((_) => "result"),
	queryWithoutArgAsyncReturn: tipcMain.queryHandler((_) => {
		return Promise.resolve();
	}),

	queryWithArgVoidReturn: tipcMain.queryHandler((_, __: number) => undefined),
	queryWithArgSyncReturn: tipcMain.queryHandler((_, input: number) => input),
	queryWithArgAsyncReturn: tipcMain.queryHandler((_, input: number) => {
		return Promise.resolve(input);
	}),

	mutationWithoutArgVoidReturn: tipcMain.mutationHandler((_) => undefined),
	mutationWithoutArgSyncReturn: tipcMain.mutationHandler((_) => "result"),
	mutationWithArgAsyncReturn: tipcMain.mutationHandler((_, input: number) => {
		return Promise.resolve(input);
	}),

	mutationWithArgVoidReturn: tipcMain.mutationHandler((_, __: number) => {
		return undefined;
	}),
	mutationWithArgSyncReturn: tipcMain.mutationHandler((_, input: number) => {
		return input;
	}),
	mutationWithoutArgAsyncReturn: tipcMain.mutationHandler((_) => {
		return Promise.resolve();
	}),

	mainSendVoidPayload: tipcMain.sender(({ send }) => {
		send({});
		return () => undefined;
	}),
	mainSendWithPayload: tipcMain.sender<MainSendPayload>(({ send }) => {
		send({ _type: "mainSend" });
		return () => undefined;
	}),

	mainSendToFrameVoidPayload: tipcMain.sender(({ sendToFrame }) => {
		sendToFrame({}, []);
		return () => undefined;
	}),
	mainSendToFrameWithPayload: tipcMain.sender<MainSendToFramePayload>(
		({ sendToFrame }) => {
			sendToFrame({ _type: "mainSendToFrame" }, []);
			return () => undefined;
		},
	),

	mainSubToRendererVoidPayload: tipcMain.subscriber((_) => {
		// noop
	}),
	mainSubToRendererWithPayload: tipcMain.subscriber<RendererSendPayload>(
		(_) => {
			// noop
		},
	),
});

const tipcRenderer = createElectronTipcRenderer<typeof _appRouter>();

describe("renderer types", () => {
	describe("query", () => {
		it("should correctly type query with arg and void return", () => {
			expect.assertions(2);

			expectTypeOf(tipcRenderer.queryWithArgVoidReturn.query).parameters
				.toMatchTypeOf<[number]>;
			expectTypeOf(tipcRenderer.queryWithArgVoidReturn.query).returns
				.toMatchTypeOf<Promise<void>>;
		});

		it("should correctly type query with arg and sync return", () => {
			expect.assertions(2);

			expectTypeOf(tipcRenderer.queryWithArgSyncReturn.query).parameters
				.toMatchTypeOf<[number]>;
			expectTypeOf(tipcRenderer.queryWithArgSyncReturn.query).returns
				.toMatchTypeOf<Promise<number>>;
		});

		it("should correctly type query with arg and async return", () => {
			expect.assertions(2);

			expectTypeOf(tipcRenderer.queryWithArgAsyncReturn.query).parameters
				.toMatchTypeOf<[number]>;
			expectTypeOf(tipcRenderer.queryWithArgAsyncReturn.query).returns
				.toMatchTypeOf<Promise<number>>;
		});
	});

	describe("mutate", () => {
		it("should correctly type mutation with arg and void return", () => {
			expect.assertions(2);

			expectTypeOf(tipcRenderer.mutationWithArgVoidReturn.mutate).parameters
				.toMatchTypeOf<[number]>;
			expectTypeOf(tipcRenderer.mutationWithArgVoidReturn.mutate).returns
				.toMatchTypeOf<Promise<void>>;
		});

		it("should correctly type mutation with arg and sync return", () => {
			expect.assertions(2);

			expectTypeOf(tipcRenderer.mutationWithArgSyncReturn.mutate).parameters
				.toMatchTypeOf<[number]>;
			expectTypeOf(tipcRenderer.mutationWithArgSyncReturn.mutate).returns
				.toMatchTypeOf<Promise<number>>;
		});

		it("should correctly type mutation with arg and async return", () => {
			expect.assertions(2);

			expectTypeOf(tipcRenderer.mutationWithArgAsyncReturn.mutate).parameters
				.toMatchTypeOf<[number]>;
			expectTypeOf(tipcRenderer.mutationWithArgAsyncReturn.mutate).returns
				.toMatchTypeOf<Promise<number>>;
		});
	});

	describe("subscribe", () => {
		it("should correctly type send from main with payload", () => {
			expect.assertions(2);

			expectTypeOf(tipcRenderer.mainSendWithPayload.subscribe).parameter(0)
				.parameters.toMatchTypeOf<[IpcRendererEvent, MainSendPayload]>;
			expectTypeOf(tipcRenderer.mainSendWithPayload.subscribe).parameter(0)
				.returns.toMatchTypeOf<void | Promise<void>>;
			expectTypeOf(
				tipcRenderer.mainSendWithPayload.subscribe,
			).returns.toBeFunction();
		});

		it("should correctly type sendToFrame from main with payload", () => {
			expect.assertions(2);

			expectTypeOf(tipcRenderer.mainSendToFrameWithPayload.subscribe).parameter(
				0,
			).parameters.toMatchTypeOf<[IpcRendererEvent, MainSendToFramePayload]>;
			expectTypeOf(tipcRenderer.mainSendToFrameWithPayload.subscribe).parameter(
				0,
			).returns.toMatchTypeOf<void | Promise<void>>;
			expectTypeOf(
				tipcRenderer.mainSendToFrameWithPayload.subscribe,
			).returns.toBeFunction();
		});
	});

	describe("send", () => {
		it("should correctly type send from renderer with payload", () => {
			expect.assertions(2);

			expectTypeOf(tipcRenderer.mainSubToRendererWithPayload.send).parameters
				.toMatchTypeOf<[RendererSendPayload]>;
			expectTypeOf(
				tipcRenderer.mainSubToRendererWithPayload.send,
			).returns.toBeVoid();
		});
	});

	describe("sendToHost", () => {
		it("should correctly type send from renderer with payload", () => {
			expect.assertions(2);

			expectTypeOf(tipcRenderer.mainSubToRendererWithPayload.sendToHost)
				.parameters.toMatchTypeOf<[RendererSendPayload]>;
			expectTypeOf(
				tipcRenderer.mainSubToRendererWithPayload.sendToHost,
			).returns.toBeVoid();
		});
	});
});
