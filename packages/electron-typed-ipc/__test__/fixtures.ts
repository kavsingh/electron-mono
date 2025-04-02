/* eslint-disable @typescript-eslint/no-invalid-void-type */
import {
	defineElectronTypedIpcSchema,
	mutation,
	query,
	sendFromMain,
	sendFromRenderer,
} from "../src/schema";

export const typedIpcApi = defineElectronTypedIpcSchema({
	queryVoidArgVoidReturn: query<void, void>(),
	queryVoidArgStringReturn: query<string, void>(),
	queryNumberArgVoidReturn: query<void, number>(),
	queryStringArgNumberReturn: query<number, string>(),

	mutationVoidArgVoidReturn: mutation<void, void>(),
	mutationVoidArgStringReturn: mutation<string, void>(),
	mutationNumberArgVoidReturn: mutation<void, number>(),
	mutationStringArgNumberReturn: mutation<number, string>(),

	sendVoidFromMain: sendFromMain<void>(),
	sendPayloadFromMain: sendFromMain<SendFromMainPayload>(),

	sendVoidFromRenderer: sendFromRenderer<void>(),
	sendPayloadFromRenderer: sendFromRenderer<SendFromRendererPayload>(),
} as const);

export type TypedIpcApi = typeof typedIpcApi;
export type SendFromMainPayload = { type: "sendFromMain" };
export type SendFromRendererPayload = { type: "sendFromRenderer" };
