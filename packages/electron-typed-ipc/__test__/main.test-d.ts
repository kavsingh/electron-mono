/* eslint-disable @typescript-eslint/no-unused-expressions */
import { describe, it, expectTypeOf, expect } from "vitest";

import { createTypedIpcMain } from "../src/main";

import { createMockIpcMain } from "./mocks";

import type {
	SendFromMainPayload,
	SendFromRendererPayload,
	TypedIpcApi,
} from "./fixtures";
import type {
	BrowserWindow,
	IpcMainEvent,
	IpcMainInvokeEvent,
	WebContents,
} from "electron";

const tipcMain = createTypedIpcMain<TypedIpcApi>(createMockIpcMain());

describe("main types", () => {
	describe("handleQuery", () => {
		it("should correctly type handleQuery without arg and void return", () => {
			expect.assertions(2);

			expectTypeOf(tipcMain.queryVoidArgVoidReturn.handleQuery).parameter(0)
				.parameters.toMatchTypeOf<[IpcMainInvokeEvent]>;
			expectTypeOf(tipcMain.queryVoidArgVoidReturn.handleQuery).parameter(0)
				.returns.toMatchTypeOf<void | Promise<void>>;
		});

		it("should correctly type handleQuery without arg and string return", () => {
			expect.assertions(2);

			expectTypeOf(tipcMain.queryVoidArgStringReturn.handleQuery).parameter(0)
				.parameters.toMatchTypeOf<[IpcMainInvokeEvent]>;
			expectTypeOf(tipcMain.queryVoidArgStringReturn.handleQuery).parameter(0)
				.returns.toMatchTypeOf<string | Promise<string>>;
		});

		it("should correctly type handleQuery with number arg and void return", () => {
			expect.assertions(2);

			expectTypeOf(tipcMain.queryNumberArgVoidReturn.handleQuery).parameter(0)
				.parameters.toMatchTypeOf<[IpcMainInvokeEvent, number]>;
			expectTypeOf(tipcMain.queryNumberArgVoidReturn.handleQuery).parameter(0)
				.returns.toMatchTypeOf<void | Promise<void>>;
		});

		it("should correctly type handleQuery with string arg and number return", () => {
			expect.assertions(2);

			expectTypeOf(tipcMain.queryStringArgNumberReturn.handleQuery).parameter(0)
				.parameters.toMatchTypeOf<[IpcMainInvokeEvent, string]>;
			expectTypeOf(tipcMain.queryStringArgNumberReturn.handleQuery).parameter(0)
				.returns.toMatchTypeOf<number | Promise<number>>;
		});
	});

	describe("handleMutation", () => {
		it("should correctly type handleMutation without arg and void return", () => {
			expect.assertions(2);

			expectTypeOf(tipcMain.mutationVoidArgVoidReturn.handleMutation).parameter(
				0,
			).parameters.toMatchTypeOf<[IpcMainInvokeEvent]>;
			expectTypeOf(tipcMain.mutationVoidArgVoidReturn.handleMutation).parameter(
				0,
			).returns.toMatchTypeOf<void | Promise<void>>;
		});

		it("should correctly type handleMutation without arg and string return", () => {
			expect.assertions(2);

			expectTypeOf(
				tipcMain.mutationVoidArgStringReturn.handleMutation,
			).parameter(0).parameters.toMatchTypeOf<[IpcMainInvokeEvent]>;
			expectTypeOf(
				tipcMain.mutationVoidArgStringReturn.handleMutation,
			).parameter(0).returns.toMatchTypeOf<string | Promise<string>>;
		});

		it("should correctly type handleMutation with number arg and void return", () => {
			expect.assertions(2);

			expectTypeOf(
				tipcMain.mutationNumberArgVoidReturn.handleMutation,
			).parameter(0).parameters.toMatchTypeOf<[IpcMainInvokeEvent, number]>;
			expectTypeOf(
				tipcMain.mutationNumberArgVoidReturn.handleMutation,
			).parameter(0).returns.toMatchTypeOf<void | Promise<void>>;
		});

		it("should correctly type handleMutation with string arg and number return", () => {
			expect.assertions(2);

			expectTypeOf(
				tipcMain.mutationStringArgNumberReturn.handleMutation,
			).parameter(0).parameters.toMatchTypeOf<[IpcMainInvokeEvent, string]>;
			expectTypeOf(
				tipcMain.mutationStringArgNumberReturn.handleMutation,
			).parameter(0).returns.toMatchTypeOf<number | Promise<number>>;
		});
	});

	describe("subscribe", () => {
		it("should correctly type send from renderer without payload", () => {
			expect.assertions(2);

			expectTypeOf(tipcMain.sendVoidFromRenderer.subscribe).parameter(0)
				.parameters.toMatchTypeOf<[IpcMainEvent]>;
			expectTypeOf(tipcMain.sendVoidFromRenderer.subscribe).parameter(0).returns
				.toMatchTypeOf<void | Promise<void>>;
			expectTypeOf(
				tipcMain.sendVoidFromRenderer.subscribe,
			).returns.toBeFunction();
		});

		it("should correctly type send from renderer with payload", () => {
			expect.assertions(2);

			expectTypeOf(tipcMain.sendPayloadFromRenderer.subscribe).parameter(0)
				.parameters.toMatchTypeOf<[IpcMainEvent, SendFromRendererPayload]>;
			expectTypeOf(tipcMain.sendPayloadFromRenderer.subscribe).parameter(0)
				.returns.toMatchTypeOf<void | Promise<void>>;
			expectTypeOf(
				tipcMain.sendPayloadFromRenderer.subscribe,
			).returns.toBeFunction();
		});
	});

	describe("send", () => {
		it("should correctly type send from main without payload", () => {
			expect.assertions(2);

			expectTypeOf(tipcMain.sendVoidFromMain.send).parameters.toMatchTypeOf<
				[BrowserWindow[] | undefined]
			>;
			expectTypeOf(tipcMain.sendVoidFromMain.send).returns.toBeVoid();
		});

		it("should correctly type send from main with payload", () => {
			expect.assertions(2);

			expectTypeOf(tipcMain.sendPayloadFromMain.send).parameters.toMatchTypeOf<
				[SendFromMainPayload, BrowserWindow[] | undefined]
			>;
			expectTypeOf(tipcMain.sendPayloadFromMain.send).returns.toBeVoid();
		});
	});

	describe("sendToFrame", () => {
		it("should correctly type sendToFrame from main without payload", () => {
			expect.assertions(2);

			expectTypeOf(tipcMain.sendVoidFromMain.sendToFrame).parameters
				.toMatchTypeOf<
				[Parameters<WebContents["sendToFrame"]>[0], BrowserWindow[] | undefined]
			>;
			expectTypeOf(tipcMain.sendVoidFromMain.sendToFrame).returns.toBeVoid();
		});

		it("should correctly type sendToHost from renderer with payload", () => {
			expect.assertions(2);

			expectTypeOf(tipcMain.sendPayloadFromMain.sendToFrame).parameters
				.toMatchTypeOf<
				[
					SendFromMainPayload,
					Parameters<WebContents["sendToFrame"]>[0],
					BrowserWindow[] | undefined,
				]
			>;
			expectTypeOf(tipcMain.sendPayloadFromMain.sendToFrame).returns.toBeVoid();
		});
	});
});
