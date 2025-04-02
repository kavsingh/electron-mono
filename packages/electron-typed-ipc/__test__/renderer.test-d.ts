/* eslint-disable @typescript-eslint/no-unused-expressions */
import { describe, it, expectTypeOf, expect } from "vitest";

import { createElectronTypedIpcRenderer } from "../src/renderer";

import type {
	SendFromMainPayload,
	SendFromRendererPayload,
	TypedIpcApi,
} from "./fixtures";
import type { SendFromRendererOptions } from "../src/renderer";
import type { IpcRendererEvent } from "electron";

const tipcRenderer = createElectronTypedIpcRenderer<TypedIpcApi>();

describe("renderer types", () => {
	describe("query", () => {
		it("should correctly type query without arg and void return", () => {
			expect.assertions(2);

			expectTypeOf(tipcRenderer.queryVoidArgVoidReturn.query).parameters
				.toExtend<[]>;
			expectTypeOf(tipcRenderer.queryVoidArgVoidReturn.query).returns.toExtend<
				Promise<void>
			>;
		});

		it("should correctly type query without arg and string return", () => {
			expect.assertions(2);

			expectTypeOf(tipcRenderer.queryVoidArgStringReturn.query).parameters
				.toExtend<[]>;
			expectTypeOf(tipcRenderer.queryVoidArgStringReturn.query).returns
				.toExtend<Promise<string>>;
		});

		it("should correctly type query with number arg and void return", () => {
			expect.assertions(2);

			expectTypeOf(tipcRenderer.queryNumberArgVoidReturn.query).parameters
				.toExtend<[number]>;
			expectTypeOf(tipcRenderer.queryNumberArgVoidReturn.query).returns
				.toExtend<Promise<void>>;
		});

		it("should correctly type query with string arg and number return", () => {
			expect.assertions(2);

			expectTypeOf(tipcRenderer.queryStringArgNumberReturn.query).parameters
				.toExtend<[string]>;
			expectTypeOf(tipcRenderer.queryStringArgNumberReturn.query).returns
				.toExtend<Promise<number>>;
		});
	});

	describe("mutate", () => {
		it("should correctly type mutation without arg and void return", () => {
			expect.assertions(2);

			expectTypeOf(tipcRenderer.mutationVoidArgVoidReturn.mutate).parameters
				.toExtend<[]>;
			expectTypeOf(tipcRenderer.mutationVoidArgVoidReturn.mutate).returns
				.toExtend<Promise<void>>;
		});

		it("should correctly type mutation without arg and string return", () => {
			expect.assertions(2);

			expectTypeOf(tipcRenderer.mutationVoidArgStringReturn.mutate).parameters
				.toExtend<[]>;
			expectTypeOf(tipcRenderer.mutationVoidArgStringReturn.mutate).returns
				.toExtend<Promise<string>>;
		});

		it("should correctly type mutation with number arg and void return", () => {
			expect.assertions(2);

			expectTypeOf(tipcRenderer.mutationNumberArgVoidReturn.mutate).parameters
				.toExtend<[number]>;
			expectTypeOf(tipcRenderer.mutationNumberArgVoidReturn.mutate).returns
				.toExtend<Promise<void>>;
		});

		it("should correctly type mutation with string arg and number return", () => {
			expect.assertions(2);

			expectTypeOf(tipcRenderer.mutationStringArgNumberReturn.mutate).parameters
				.toExtend<[string]>;
			expectTypeOf(tipcRenderer.mutationStringArgNumberReturn.mutate).returns
				.toExtend<Promise<number>>;
		});
	});

	describe("subscribe", () => {
		it("should correctly type send from main without payload", () => {
			expect.assertions(2);

			expectTypeOf(tipcRenderer.sendVoidFromMain.subscribe).parameter(0)
				.parameters.toExtend<[IpcRendererEvent]>;
			expectTypeOf(tipcRenderer.sendVoidFromMain.subscribe).parameter(0).returns
				.toExtend<void | Promise<void>>;
			expectTypeOf(
				tipcRenderer.sendVoidFromMain.subscribe,
			).returns.toBeFunction();
		});

		it("should correctly type send from main with payload", () => {
			expect.assertions(2);

			expectTypeOf(tipcRenderer.sendPayloadFromMain.subscribe).parameter(0)
				.parameters.toExtend<[IpcRendererEvent, SendFromMainPayload]>;
			expectTypeOf(tipcRenderer.sendPayloadFromMain.subscribe).parameter(0)
				.returns.toExtend<void | Promise<void>>;
			expectTypeOf(
				tipcRenderer.sendPayloadFromMain.subscribe,
			).returns.toBeFunction();
		});
	});

	describe("send", () => {
		it("should correctly type send from renderer without payload", () => {
			expect.assertions(2);

			expectTypeOf(tipcRenderer.sendVoidFromRenderer.send).parameters.toExtend<
				[undefined, SendFromRendererOptions | undefined]
			>;
			expectTypeOf(tipcRenderer.sendVoidFromRenderer.send).returns.toBeVoid();
		});

		it("should correctly type send from renderer with payload", () => {
			expect.assertions(2);

			expectTypeOf(tipcRenderer.sendPayloadFromRenderer.send).parameters
				.toExtend<
				[SendFromRendererPayload, SendFromRendererOptions | undefined]
			>;
			expectTypeOf(
				tipcRenderer.sendPayloadFromRenderer.send,
			).returns.toBeVoid();
		});
	});
});
