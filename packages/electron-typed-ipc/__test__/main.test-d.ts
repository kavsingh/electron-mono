import { describe, it, expectTypeOf, expect } from "vitest";

import { createElectronTypedIpcMain } from "../src/main";

import { typedIpcApi } from "./fixtures";
import { createMockIpcMain } from "./mocks";

import type { SendFromRendererPayload } from "./fixtures";
import type { IpcMainEvent, IpcMainInvokeEvent } from "electron";

const { ipcHandleAndSend: handleAndSend, ipcSubscriptions } =
	createElectronTypedIpcMain(typedIpcApi, createMockIpcMain());

type Params = Parameters<typeof handleAndSend>[0];
const ops = {} as { [K in keyof Params]-?: Params[K] };

describe("main types", () => {
	describe("handleAndSend", () => {
		describe("return type", () => {
			it("should return a dispose function", () => {
				expect.assertions(1);

				expectTypeOf(handleAndSend).returns.toExtend<() => void>;
			});
		});

		describe("query", () => {
			it("should correctly type query handler without arg and void return", () => {
				expect.assertions(2);

				expectTypeOf(ops.queryVoidArgVoidReturn).parameters.toExtend<
					[IpcMainInvokeEvent]
				>;
				expectTypeOf(ops.queryVoidArgVoidReturn).returns
					.toExtend<void | Promise<void>>;
			});

			it("should correctly type query handler without arg and string return", () => {
				expect.assertions(2);

				expectTypeOf(ops.queryVoidArgStringReturn).parameters.toExtend<
					[IpcMainInvokeEvent]
				>;
				expectTypeOf(ops.queryVoidArgStringReturn).returns.toExtend<
					string | Promise<string>
				>;
			});

			it("should correctly type query handler with number arg and void return", () => {
				expect.assertions(2);

				expectTypeOf(ops.queryNumberArgVoidReturn).parameters.toExtend<
					[IpcMainInvokeEvent, number]
				>;
				expectTypeOf(ops.queryNumberArgVoidReturn).returns
					.toExtend<void | Promise<void>>;
			});

			it("should correctly type query handler with string arg and number return", () => {
				expect.assertions(2);

				expectTypeOf(ops.queryStringArgNumberReturn).parameters.toExtend<
					[IpcMainInvokeEvent, string]
				>;
				expectTypeOf(ops.queryStringArgNumberReturn).returns.toExtend<
					number | Promise<number>
				>;
			});
		});

		describe("mutation", () => {
			it("should correctly type mutation handler without arg and void return", () => {
				expect.assertions(2);

				expectTypeOf(ops.mutationVoidArgVoidReturn).parameters.toExtend<
					[IpcMainInvokeEvent]
				>;
				expectTypeOf(ops.mutationVoidArgVoidReturn).returns
					.toExtend<void | Promise<void>>;
			});

			it("should correctly type mutation handler without arg and string return", () => {
				expect.assertions(2);

				expectTypeOf(ops.mutationVoidArgStringReturn).parameters.toExtend<
					[IpcMainInvokeEvent]
				>;
				expectTypeOf(ops.mutationVoidArgStringReturn).returns.toExtend<
					string | Promise<string>
				>;
			});

			it("should correctly type mutation handler with number arg and void return", () => {
				expect.assertions(2);

				expectTypeOf(ops.mutationNumberArgVoidReturn).parameters.toExtend<
					[IpcMainInvokeEvent, number]
				>;
				expectTypeOf(ops.mutationNumberArgVoidReturn).returns
					.toExtend<void | Promise<void>>;
			});

			it("should correctly type mutation handler with string arg and number return", () => {
				expect.assertions(2);

				expectTypeOf(ops.mutationStringArgNumberReturn).parameters.toExtend<
					[IpcMainInvokeEvent, string]
				>;
				expectTypeOf(ops.mutationStringArgNumberReturn).returns.toExtend<
					number | Promise<number>
				>;
			});
		});

		describe("send", () => {
			it.todo("should correctly type send fn without payload");

			it.todo("should correctly type send fn with payload");
		});
	});

	describe("ipcSubscriptions", () => {
		it("should correctly type send from renderer without payload", () => {
			expect.assertions(3);

			expectTypeOf(ipcSubscriptions.sendVoidFromRenderer.subscribe).parameter(0)
				.parameters.toExtend<[IpcMainEvent]>;
			expectTypeOf(ipcSubscriptions.sendVoidFromRenderer.subscribe).parameter(0)
				.returns.toExtend<void | Promise<void>>;
			expectTypeOf(ipcSubscriptions.sendVoidFromRenderer.subscribe).returns
				.toExtend<() => void>;
		});

		it("should correctly type send from renderer with payload", () => {
			expect.assertions(3);

			expectTypeOf(
				ipcSubscriptions.sendPayloadFromRenderer.subscribe,
			).parameter(0).parameters.toExtend<
				[IpcMainEvent, SendFromRendererPayload]
			>;
			expectTypeOf(
				ipcSubscriptions.sendPayloadFromRenderer.subscribe,
			).parameter(0).returns.toExtend<void | Promise<void>>;
			expectTypeOf(ipcSubscriptions.sendPayloadFromRenderer.subscribe).returns
				.toExtend<() => void>;
		});
	});
});
