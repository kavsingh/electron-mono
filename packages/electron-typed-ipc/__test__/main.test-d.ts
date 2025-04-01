/* eslint-disable @typescript-eslint/no-unused-expressions */
import { describe, it, expectTypeOf, expect } from "vitest";

import { createElectronTypedIpcMain } from "../src/main";

import { createMockIpcMain } from "./mocks";

import type {
	SendFromMainPayload,
	SendFromRendererPayload,
	TypedIpcApi,
} from "./fixtures";
import type { SendFromMainOptions } from "../src/main";
import type { IpcMainEvent, IpcMainInvokeEvent } from "electron";

const tipcMain = createElectronTypedIpcMain<TypedIpcApi>(createMockIpcMain());

describe("main types", () => {
	describe("handleQuery", () => {
		it("should correctly type handleQuery without arg and void return", () => {
			expect.assertions(2);

			expectTypeOf(tipcMain.queryVoidArgVoidReturn.handleQuery).parameter(0)
				.parameters.toExtend<[IpcMainInvokeEvent]>;
			expectTypeOf(tipcMain.queryVoidArgVoidReturn.handleQuery).parameter(0)
				.returns.toExtend<void | Promise<void>>;
		});

		it("should correctly type handleQuery without arg and string return", () => {
			expect.assertions(2);

			expectTypeOf(tipcMain.queryVoidArgStringReturn.handleQuery).parameter(0)
				.parameters.toExtend<[IpcMainInvokeEvent]>;
			expectTypeOf(tipcMain.queryVoidArgStringReturn.handleQuery).parameter(0)
				.returns.toExtend<string | Promise<string>>;
		});

		it("should correctly type handleQuery with number arg and void return", () => {
			expect.assertions(2);

			expectTypeOf(tipcMain.queryNumberArgVoidReturn.handleQuery).parameter(0)
				.parameters.toExtend<[IpcMainInvokeEvent, number]>;
			expectTypeOf(tipcMain.queryNumberArgVoidReturn.handleQuery).parameter(0)
				.returns.toExtend<void | Promise<void>>;
		});

		it("should correctly type handleQuery with string arg and number return", () => {
			expect.assertions(2);

			expectTypeOf(tipcMain.queryStringArgNumberReturn.handleQuery).parameter(0)
				.parameters.toExtend<[IpcMainInvokeEvent, string]>;
			expectTypeOf(tipcMain.queryStringArgNumberReturn.handleQuery).parameter(0)
				.returns.toExtend<number | Promise<number>>;
		});
	});

	describe("handleMutation", () => {
		it("should correctly type handleMutation without arg and void return", () => {
			expect.assertions(2);

			expectTypeOf(tipcMain.mutationVoidArgVoidReturn.handleMutation).parameter(
				0,
			).parameters.toExtend<[IpcMainInvokeEvent]>;
			expectTypeOf(tipcMain.mutationVoidArgVoidReturn.handleMutation).parameter(
				0,
			).returns.toExtend<void | Promise<void>>;
		});

		it("should correctly type handleMutation without arg and string return", () => {
			expect.assertions(2);

			expectTypeOf(
				tipcMain.mutationVoidArgStringReturn.handleMutation,
			).parameter(0).parameters.toExtend<[IpcMainInvokeEvent]>;
			expectTypeOf(
				tipcMain.mutationVoidArgStringReturn.handleMutation,
			).parameter(0).returns.toExtend<string | Promise<string>>;
		});

		it("should correctly type handleMutation with number arg and void return", () => {
			expect.assertions(2);

			expectTypeOf(
				tipcMain.mutationNumberArgVoidReturn.handleMutation,
			).parameter(0).parameters.toExtend<[IpcMainInvokeEvent, number]>;
			expectTypeOf(
				tipcMain.mutationNumberArgVoidReturn.handleMutation,
			).parameter(0).returns.toExtend<void | Promise<void>>;
		});

		it("should correctly type handleMutation with string arg and number return", () => {
			expect.assertions(2);

			expectTypeOf(
				tipcMain.mutationStringArgNumberReturn.handleMutation,
			).parameter(0).parameters.toExtend<[IpcMainInvokeEvent, string]>;
			expectTypeOf(
				tipcMain.mutationStringArgNumberReturn.handleMutation,
			).parameter(0).returns.toExtend<number | Promise<number>>;
		});
	});

	describe("subscribe", () => {
		it("should correctly type send from renderer without payload", () => {
			expect.assertions(2);

			expectTypeOf(tipcMain.sendVoidFromRenderer.subscribe).parameter(0)
				.parameters.toExtend<[IpcMainEvent]>;
			expectTypeOf(tipcMain.sendVoidFromRenderer.subscribe).parameter(0).returns
				.toExtend<void | Promise<void>>;
			expectTypeOf(
				tipcMain.sendVoidFromRenderer.subscribe,
			).returns.toBeFunction();
		});

		it("should correctly type send from renderer with payload", () => {
			expect.assertions(2);

			expectTypeOf(tipcMain.sendPayloadFromRenderer.subscribe).parameter(0)
				.parameters.toExtend<[IpcMainEvent, SendFromRendererPayload]>;
			expectTypeOf(tipcMain.sendPayloadFromRenderer.subscribe).parameter(0)
				.returns.toExtend<void | Promise<void>>;
			expectTypeOf(
				tipcMain.sendPayloadFromRenderer.subscribe,
			).returns.toBeFunction();
		});
	});

	describe("send", () => {
		it("should correctly type send from main without payload", () => {
			expect.assertions(2);

			expectTypeOf(tipcMain.sendVoidFromMain.send).parameters.toExtend<
				[undefined, SendFromMainOptions | undefined]
			>;
			expectTypeOf(tipcMain.sendVoidFromMain.send).returns.toBeVoid();
		});

		it("should correctly type send from main with payload", () => {
			expect.assertions(2);

			expectTypeOf(tipcMain.sendPayloadFromMain.send).parameters.toExtend<
				[SendFromMainPayload, SendFromMainOptions | undefined]
			>;
			expectTypeOf(tipcMain.sendPayloadFromMain.send).returns.toBeVoid();
		});
	});
});
