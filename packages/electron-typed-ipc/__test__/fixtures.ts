import type {
	DefineTypedIpc,
	TypedIpcMutation,
	TypedIpcQuery,
	TypedIpcSendFromMain,
	TypedIpcSendFromRenderer,
} from "../src/common";

export type TypedIpcApi = DefineTypedIpc<{
	queryVoidArgVoidReturn: TypedIpcQuery<void, void>;
	queryVoidArgStringReturn: TypedIpcQuery<string, void>;
	queryNumberArgVoidReturn: TypedIpcQuery<void, number>;
	queryStringArgNumberReturn: TypedIpcQuery<number, string>;

	mutationVoidArgVoidReturn: TypedIpcMutation<void, void>;
	mutationVoidArgStringReturn: TypedIpcMutation<string, void>;
	mutationNumberArgVoidReturn: TypedIpcMutation<void, number>;
	mutationStringArgNumberReturn: TypedIpcMutation<number, string>;

	sendVoidFromMain: TypedIpcSendFromMain<void>;
	sendPayloadFromMain: TypedIpcSendFromMain<SendFromMainPayload>;

	sendVoidFromRenderer: TypedIpcSendFromRenderer<void>;
	sendPayloadFromRenderer: TypedIpcSendFromRenderer<SendFromRendererPayload>;
}>;

export type SendFromMainPayload = { type: "sendFromMain" };
export type SendFromRendererPayload = { type: "sendFromRenderer" };
