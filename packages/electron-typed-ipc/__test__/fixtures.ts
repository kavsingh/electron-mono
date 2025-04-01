import type {
	DefineElectronTypedIpcSchema,
	Mutation,
	Query,
	SendFromMain,
	SendFromRenderer,
} from "../src/common";

export type TypedIpcApi = DefineElectronTypedIpcSchema<{
	queryVoidArgVoidReturn: Query<void, void>;
	queryVoidArgStringReturn: Query<string, void>;
	queryNumberArgVoidReturn: Query<void, number>;
	queryStringArgNumberReturn: Query<number, string>;

	mutationVoidArgVoidReturn: Mutation<void, void>;
	mutationVoidArgStringReturn: Mutation<string, void>;
	mutationNumberArgVoidReturn: Mutation<void, number>;
	mutationStringArgNumberReturn: Mutation<number, string>;

	sendVoidFromMain: SendFromMain<void>;
	sendPayloadFromMain: SendFromMain<SendFromMainPayload>;

	sendVoidFromRenderer: SendFromRenderer<void>;
	sendPayloadFromRenderer: SendFromRenderer<SendFromRendererPayload>;
}>;

export type SendFromMainPayload = { type: "sendFromMain" };
export type SendFromRendererPayload = { type: "sendFromRenderer" };
